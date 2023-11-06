<template>
  <div
    v-if="document.title && document.title.length || editable > 0"
    class="document-title__component"
  >
    <div>
      <!-- TODO Victor: to add highlights to Titles (visualisation only : not ES highlights)
      <header v-if="!preview && searchTerm && highlight(titleContent).includes('mark')">
        <title-field-in-place
          :tabulation-index="0"
          label="Titre"
          name="title"
          not-set="Non renseigné"
          :initial-value="highlight(titleContent)"
          :editable="editable"
          :status="titleStatus"
          specific-class="field-title__input"
          @changed="titleChanged"
          @add-note="addNote($event)"
          @refresh-title="refreshTitle($event)"
          @on-keyup-escape="cancelInput($event)"
        />
      </header> -->
      <header v-if="!preview"><!-- TODO Victor: if highlights (see above) change to v-else-if -->
        <title-field-in-place
          :tabulation-index="0"
          label="Titre"
          name="title"
          not-set="Non renseigné"
          :initial-value="titleContent"
          :editable="editable"
          :status="titleStatus"
          specific-class="field-title__input"
          @changed="titleChanged"
          @add-note="addNote($event)"
          @refresh-title="refreshTitle($event)"
          @on-keyup-escape="cancelInput($event)"
          @save-title="saveTitle()"
        />
      </header>
      <!-- // switch TitleFieldInPlace to RichTextEditor :
        <span
          v-if="editable && !editMode"
          class="edit-btn"
          @click="enterEditMode"
        />
        <rich-text-editor
          v-if="editable && editMode"
          v-model="titleContent"
          class="??"
          :editable="editable && editMode"
          :formats="[['close'], ['italic', 'superscript'], ['note']]"
          @changed="titleChanged"
          @add-note="addNote($event)"
          @on-keyup-escape="cancelInput($event)"
          @refresh-title="refreshTitle($event)"
        >
          <editor-save-button
            :doc-id="document.id"
            name="title"
            :value="titleContent"
          />
        </rich-text-editor>
      </header>-->

      <!--<header v-if="!preview">
      <title-field-in-place
        :tabulation-index="0"
        label="Titre"
        name="title"
        not-set="Non renseigné"
        :initial-value="document.title"
        :editable="editable"
        :status="titleStatus"
        specific-class="field-title__input"
        @changed="titleChanged"
        @add-note="addNote($event)"
      />
    </header>-->
      <!--<div
        v-else-if="!preview && searchTerm && highlight(document.title).includes('mark')"
        class="argument__content"
        v-html="highlight(document.title)">
      </div>-->
      <div
        v-else
        class="argument__content"
        v-html="titleContent"
      />
      <!--<div v-if="!preview && titleContent">
        <document-notes
            v-show="false"
          :editable="editable"
          :title-editor="titleContent"
        />
      </div>-->
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TitleFieldInPlace from "../forms/fields/TitleFieldInPlace";
// switch TitleFieldInPlace to RichTextEditor : import EditorSaveButton from "@/components/forms/fields/EditorSaveButton.vue";
// switch TitleFieldInPlace to RichTextEditor : import RichTextEditor from "@/components/forms/fields/RichTextEditor.vue";
import escapeRegExp from "lodash/escapeRegExp";
//import DocumentNotes from "@/components/document/DocumentNotes.vue";

export default {
  name: "DocumentTitle",
  components: {TitleFieldInPlace}, //switch TitleFieldInPlace to RichTextEditor : RichTextEditor, EditorSaveButton
  emit: ["add-note"],
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    editAttributes: {
      type: Boolean,
      default: true,
    },
    preview: {
      type: Boolean,
      default: false,
    },
   titleEditor: {
      type: String,
      default: "",
    },
  },
  emits: ["add-note", "refresh-title", "save-title"],
  data() {
    return {
      titleStatus: "normal",
      titleContent:"",
      // if RTE instead of TitleFieldInPlace editMode: false,
    };
  },
  watch: {
    titleEditor: function (newVal, OldVal) {
      console.log("DocumentTitle / watch / titleEditor old new: ", OldVal, newVal)
      this.titleContent = newVal}
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm"])
  },
  mounted() {
    console.log("this.searchTerm : ", this.searchTerm)
    this.titleContent = this.$props.titleEditor ? this.$props.titleEditor: this.document.title;
    console.log("DocumentTitle / Created / this.titleContent : ", this.titleContent)
    //TODO Victor remove once [note] have been replaced in database
    this.getNoteIndex(this.titleContent, "title")
  },
  methods: {
    cancelInput(evt) {
      console.log("Title event ", { ...evt });
      this.enterEditMode()
    },
    /* if RTE instead of TitleFieldInPlace
    enterEditMode() {
      this.editMode = !this.editMode
      console.log("Title editMode updated", this.editMode)
    },*/
    titleChanged(fieldProps) {
      const data = { id: this.document.id, attributes: {} };
      data.attributes[fieldProps.name] = fieldProps.value;
      this.titleSetStatusNormal();
      this.$store
        .dispatch("document/save", data)
        .then((response) => {
          this.titleSetStatusSuccess();
          setTimeout(this.titleSetStatusNormal, 3000);
        })
        .catch(() => {
          this.titleSetStatusError();
          setTimeout(this.titleSetStatusNormal, 3000);
        });
    },
    titleSetStatusNormal() {
      this.titleStatus = "normal";
    },
    titleSetStatusSuccess() {
      this.titleStatus = "success";
    },
    titleSetStatusError() {
      this.titleStatus = "error";
    },
    addNote(evt) {
      console.log("title addNote(evt)", evt, {...evt});
      this.$emit("add-note", { ...evt });
    },
    refreshTitle(evt) {
      console.log("DocumentTitle / refreshTitle(evt)", evt)
      this.$emit("refresh-title",  evt)
      this.titleContent = evt
    },
    saveTitle() {
      this.$emit("save-title")
    },
    highlight(text) {
      // Split search terms (by space) if multiple
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      // Create regex with list of search terms and ensuring they are not searched within attributes (eg do not match/replace "a" in <a class=""...>
      const re = new RegExp(`(${terms.join("|")})(?=[^<>]*<)`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    },
    //TODO Victor remove once [note] have been replaced in database
    getNoteIndex(content, type) {
      const pattern = /<a class="note" href="#(\d+)">\[note]<\/a>/gmi
      console.log("DocumentTranscription / getNoteIndex", content, type)
      if (content) {
        this.contentPrep = content
        console.log(`DocumentTranscription / getNoteIndex / this.${type}Prep : `, this.contentPrep)
        let inContent = pattern.test(this.contentPrep);
        console.log(`in${type}`, inContent)
        if (inContent) {
          console.log(`in${type}`, this.contentPrep)
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
            this.titleContent = this.titleContent.replace(m[0], m[0].replace('[note]', '[' + m[2] + ']'));
          })
          console.log(`in${type} replaced`, this.titleContent)
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.document-title__component {
  margin-bottom: 15px;
}
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
