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
        v-if="editable && !editMode"
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
        v-else-if="!preview && searchTerm && searchTerm.length > 0 && highlight(form).includes('mark')"
        class="argument__content"
        v-html="form && form.length > 0 ? highlight(form) : 'Non renseignée'"
      />
      <div
        v-else-if="preview && searchTerm && searchTerm.length > 0 && highlight(form).includes('mark')"
        class="argument__content"
        v-html="form && form.length > 0 ? highlight(form) : 'Non renseignée'"
      />
      <div
        v-else
        class="argument__content"
        v-html="form && form.length > 0 ? form : 'Non renseignée'"
      />
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
  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm"])
  },
  watch: {
    argumentEditor: function (newVal, Oldval) {
      console.log("DocumentArgument / watch / form old new : ", Oldval, newVal)
      this.form = newVal;
      this.$emit("refresh-argument", this.form)
    },
  },
  mounted() {
    this.form = this.document.argument || "";
    if (!this.preview) {
      //TODO Victor remove once [note] have been replaced in database
      this.getNoteIndex(this.form, "argument");

      //TODO Victor remove once attributes title have been added in database
      this.getPersonsLabel(this.form, "argument");

      //TODO Victor remove once attributes title have been added in database
      this.getPlacesLabel(this.form, "argument");
    }
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
    cleanHTML(text) {
      // remove notes from Titles in search results table
      if (text && text.length > 0) {
        return text.replace(/<[^p][^>]*>/gi, '');
      }
    },
    highlight(text) {
      // function called only if this.searchTerm && this.searchTerm.length > 0
      // split search terms (by space) if multiple
      // if (/^"".*""$/.test(text)) {TODO Victor : implement enclosed in quotes ?
      // previous rule : const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const terms = this.searchTerm.replaceAll(/^"|"$/g, "").split(new RegExp("[,;:.\\s+]+")).map(escapeRegExp).filter(term => term !== "");
      //let terms = this.searchTerm.replaceAll(/^"|"$/g, "").match(/\p{L}+|\d+/gu); // TODO Victor : does match "i568" works with .match(/\p{L}{2,}|\p{L}+\d+/gu)
      if (terms && terms.length > 0) {
        console.log('terms without quotes :', terms)
        // Create regex with list of search terms and ensuring they are not searched within attributes (eg do not match/replace "a" in <a class=""...>
        /*with word boundaries
        let regexTerms = [];
        for (let i = 0, len = terms.length; i < len; i++) {
          regexTerms.push("\\b" + terms[i] + "\\b");
        const re = new RegExp(`(${regexTerms.join("|")})(?=[^<>]*<)`);
        }*/
        const re = new RegExp(`(?:(?!\\w)|\\b(?=\\w))(${terms.join("|")})(?:(?<=\\w)\\b|(?<!\\w))(?=[^<>]*<)`);
        console.log("match without quotes re :", re)
        return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`));
      /*} else {TODO Victor : if enclosed in quotes tests
        let searchTermWithoutQuotes = this.searchTerm.replaceAll(/^"|"$/g, "");
        let terms = searchTermWithoutQuotes.split(/((?<=\s)|,)/g).filter(term => term !== "");
        console.log("match with quotes terms :", terms)
        const first_term = terms[0];
        const last_term = terms.slice(-1);
        const re = new RegExp(`(${terms.join("|")})(?=[^<>]*<)`);
        //const re = new RegExp(`${first_term}.*?${last_term}\\s?[^<]*<\\/[^<]*>(?=[^<>]*<)`);
        console.log("match with quotes re :", re)
        return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`));
      }*/
      } else {
        return text
      }
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
