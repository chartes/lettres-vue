<template>
  <div
    v-if="document.argument && document.argument.length || editable > 0"
    class="panel"
  ><!-- (document.argument && document.argument.length) || editable > 0 -->
    <div
      class="panel-block"
      style="display: inline-block; width: 100%"
    >
      <span
        v-if="!editMode"
        class="edit-btn"
        @click="enterEditMode"
      />
      <rich-text-editor
        v-if="editable && editMode"
        v-model="form"
        label="argument"
        :formats="[
          ['close'],
          ['italic', 'superscript'],
          ['person', 'location'],
          ['note', 'link']
        ]"
        @add-place="addPlace($event, 'argument')"
        @add-person="addPerson($event, 'argument')"
        @add-note="addNote($event)"
        @refresh-argument="refreshArgument($event)"
        @on-keyup-escape="cancelInput($event)"
      >
        <editor-save-button
          :doc-id="document.id"
          name="argument"
          :value="form"
        />
      </rich-text-editor>
      <div
        v-else-if="!preview && searchTerm && highlight(form).includes('mark')"
        class="argument__content"
        v-html="highlight(form)">
      </div>
      <div
        v-else
        class="argument__content"
        v-html="form && form.length > 0 ? form : 'Non renseignée'">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextEditor from "../forms/fields/RichTextEditor";
import EditorSaveButton from "../forms/fields/EditorSaveButton";
import escapeRegExp from "lodash/escapeRegExp";

export default {
  name: "DocumentArgument",
  components: { EditorSaveButton, RichTextEditor },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    argumentEditor: {
      type: String,
      default: "",
    }
  },
  emits: ["add-place", "add-person", "add-note", "refresh-argument"],
  data() {
    return {
      //editorEnabled: true,
      editMode: false,
      form: "",
    };
  },
  watch: {
    argumentEditor: function (newVal, Oldval) {
      console.log("DocumentArgument / watch / form old new : ", Oldval, newVal)
      this.form = newVal;
      this.$emit("refresh-argument", this.form)
    },
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm"])
  },
  mounted() {
    this.form = this.document.argument || "";
    //TODO Victor remove once [note] have been replaced in database
    this.getNoteIndex(this.form, "argument");

    //TODO Victor remove once attributes title have been added in database
    this.getPersonsLabel(this.form, "argument");

    //TODO Victor remove once attributes title have been added in database
    this.getPlacesLabel(this.form, "argument");

  },
  created() {
    console.log("argument created searchTerm : ", this.searchTerm)
    console.log("argument created editMode : ", this.editMode)
  },
  methods: {
    cancelInput(evt) {
      console.log("argument event ", { ...evt });
      this.enterEditMode()
    },
    enterEditMode() {
      this.editMode = !this.editMode
      console.log("argument editMode updated", this.editMode)
    },
    addPlace(evt, source) {
      this.$emit("add-place", { ...evt, source });
    },
    addPerson(evt, source) {
      this.$emit("add-person", { ...evt, source });
    },
    addNote(evt) {
      this.$emit("add-note", { ...evt });
    },
    refreshArgument(evt) {
      console.log("DocumentArgument / refreshArgument(evt)", evt);
      this.form = evt;
      this.$emit("refresh-argument", evt)
    },

    highlight(text) {
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const re = new RegExp(`(${terms.join("|")})`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    },
    //TODO Victor remove once [note] have been replaced in database
    getNoteIndex(content, type) {
      const pattern = /<a class="note" href="#(\d+)">\[note]<\/a>/gmi
      console.log("DocumentArgument / getNoteIndex", content, type)
      if (content) {
        this.contentPrep = content
        //console.log(`DocumentArgument / getNoteIndex / this.${type}Prep : `, this.contentPrep)
        let inContent = pattern.test(this.contentPrep);
        console.log(`DocumentArgument / getNoteIndex in${type}`, inContent)
        if (inContent) {
          //console.log(`in${type}`, this.contentPrep)
          let contentMatch = content.match(pattern)
          //console.log(`${type}Match`, contentMatch)
          let contentMatches = [...content.matchAll(pattern)]
          //console.log(`${type}Matches`, contentMatches)
          let DocumentsNotes = this.$store.state.document.notes
          let contentMatcheswithIndex = []
          //console.log("DocumentsNotes", DocumentsNotes)
          contentMatches.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], DocumentsNotes.findIndex(n => n.id === parseInt(m[1])) + 1)
            m.push(String(DocumentsNotes.findIndex(n => n.id === parseInt(m[1])) + 1))
            contentMatcheswithIndex.push(m)
            //console.log(`${type}withIndex`, contentMatcheswithIndex)
          })
          contentMatcheswithIndex.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], typeof (m[1]))
            //console.log("m[0].replace('[note]', '['+ m[2] +']')", m[0].replace('[note]', '[' + m[2] + ']'))
            this.form = this.form.replace(m[0], m[0].replace('[note]', '[' + m[2] + ']'));
          })
          console.log(`DocumentArgument / getNoteIndex / in${type} replaced`, this.form)
        }
      }
    },
    //TODO Victor remove once attributes title have been added in database
    async getPersonsLabel(content, type) {
      const persPattern = /<a class="persName" target="_blank" href="[^>]*" id="(\d+)">[^<]*<\/a>/gmi
      console.log("DocumentArgument / getPersonsLabel", content, type)
      if (content) {
        this.contentPrep = content
        //console.log(`DocumentArgument / getPersonsLabel / this.${type}Prep : `, this.contentPrep)
        let inContent = persPattern.test(this.contentPrep);
        console.log(`DocumentArgument / getPersonsLabel in${type}`, inContent)
        if (inContent) {
          //console.log(`DocumentArgument / getPersonsLabel in${type}`, this.contentPrep)
          let contentMatch = content.match(persPattern)
          console.log(`DocumentArgument / getPersonsLabel ${type}Match`, contentMatch)
          let contentMatches = [...content.matchAll(persPattern)]
          //console.log(`DocumentArgument / getPersonsLabel ${type}Matches`, contentMatches)
          let contentMatcheswithLabel = []
          await Promise.all(contentMatches.map(async (m) => {
            await this.$store.dispatch("persons/getPersonById", parseInt(m[1])).then(
                (response) => {
                  //console.log("m[0], m[1], response.attributes.label", m[0], m[1], response.attributes.label)
                  m.push(response.attributes.label)
                  contentMatcheswithLabel.push(m)
                }
            )
            //console.log(`DocumentArgument / getPersonsLabel contentMatcheswithLabel`, contentMatcheswithLabel)
          }))
          contentMatcheswithLabel.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], typeof (m[1]))
            console.log("m[0].replace('target=\"_blank\"', 'target=\"_blank\"' + ' title=\"' + m[2] + '\"')", m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'))
            this.form = this.form.replace(m[0], m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'));
          })
          console.log(`DocumentArgument / getPersonsLabel in${type} replaced`, this.form)
        }
      }
    },
    //TODO Victor remove once attributes title have been added in database
    async getPlacesLabel(content, type) {
      const placePattern = /<a class="placeName" target="_blank" href="[^>]*" id="(\d+)">[^<]*<\/a>/gmi
      console.log("DocumentArgument / getPlacesLabel", content, type)
      if (content) {
        this.contentPrep = content
        //console.log(`DocumentArgument / getPlacesLabel / this.${type}Prep : `, this.contentPrep)
        let inContent = placePattern.test(this.contentPrep);
        console.log(`DocumentArgument / getPlacesLabel in${type}`, inContent)
        if (inContent) {
          //console.log(`DocumentArgument / getPlacesLabel in${type}`, this.contentPrep)
          let contentMatch = content.match(placePattern)
          console.log(`DocumentArgument / getPlacesLabel / ${type}Match`, contentMatch)
          let contentMatches = [...content.matchAll(placePattern)]
          //console.log(`DocumentArgument / getPlacesLabel / ${type}Matches`, contentMatches)
          let contentMatcheswithLabel = []
          await Promise.all(contentMatches.map(async (m) => {
            await this.$store.dispatch("placenames/getPlacenameById", parseInt(m[1])).then(
                (response) => {
                  //console.log("m[0], m[1], response.attributes.label", m[0], m[1], response.attributes.label)
                  m.push(response.attributes.label)
                  contentMatcheswithLabel.push(m)
                }
            )
            //console.log(`DocumentArgument / getPlacesLabel / ${type}withTitle`, contentMatcheswithLabel)
          }))
          contentMatcheswithLabel.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], typeof (m[1]))
            console.log("m[0].replace('target=\"_blank\"', 'target=\"_blank\"' + ' title=\"' + m[2] + '\"')", m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'))
            this.form = this.form.replace(m[0], m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'));
          })
          console.log(`DocumentArgument / getPlacesLabel in${type} replaced`, this.form)
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.notes {
  margin-top: 40px;
  margin-bottom: 40px;
  padding-top: 20px;
  border-top: solid 1px darkgrey;
  color: grey;
}
.section {
  padding-top: 24px;
  padding-bottom: 24px;
}
/*span.edit-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  cursor: pointer;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  i {
    display: none;
  }
  .icon.icon__pen-edit {
    display: none;
  }
}*/
.edit-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  @include on-mobile {
    flex: 45px 0 0;
  }

  .icon.icon__pen-edit {
    display: none;
  }
}
</style>
