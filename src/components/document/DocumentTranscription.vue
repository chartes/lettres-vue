<template>
  <div class="document__transcription">
    <div class="panel">
      <div
        v-if="!preview"
        class="panel-block"
        style="display: inline-block; width: 100%"
      >
        <h3 class="heading">
          Adresse
        </h3>
        <span
          v-if="editable"
          class="edit-btn"
          @click="enterEditModeAddress"
        />
        <rich-text-editor
          v-if="editable && editModeAddress"
          v-model="addressContent"
          :formats="[['italic', 'superscript'], ['person', 'location'], ['note']]"
          @add-place="addPlace($event, 'address')"
          @add-person="addPerson($event, 'address')"
          @add-note="addNote($event)"
        >
          <editor-save-button
            :doc-id="document.id"
            name="address"
            :value="addressContent"
          />
        </rich-text-editor>
        <div
          v-else-if="!preview && searchTerm"
          class="document__transcription--content"
          v-html="highlight(addressContent)"
        />
        <div
          v-else
          class="document__transcription--content"
          v-html="addressContent"
        />
      </div>

      <div
        class="panel-block document__transcription--tr-content"
        style="display: inline-block; width: 100%"
      >
        <h3
          v-if="!preview"
          class="heading mt-3"
        >
          Lettre
        </h3>
        <span
          v-if="editable"
          class="edit-btn"
          @click="enterEditModeTranscription"
        />
        <rich-text-editor
          v-if="editable && editModeTranscription"
          v-model="transcriptionContent"
          :formats="[['italic', 'superscript', 'page'], ['person', 'location'], ['note']]"
          @add-place="addPlace($event, 'transcription')"
          @add-person="addPerson($event, 'transcription')"
          @add-note="addNote($event)"
        >
          <editor-save-button
            :doc-id="document.id"
            name="transcription"
            :value="transcriptionContent"
          />
        </rich-text-editor>
        <div
          v-else-if="preview && searchTerm && Array.isArray(transcriptionContent)"
          class="document__transcription--content"
        >
          <span
            v-for="(phrase, index) in transcriptionContent"
            class="highlighted"
            :key="index"
            v-html="phrase"
          >
            <!--<span
              v-html="phrase"
              class="highlighted"
            />-->
          </span>
        </div>
        <div
          v-else-if="!preview && searchTerm"
          class="document__transcription--content"
        >
          <span v-for="(phrase, index) in highlight(transcriptionContent).replaceAll('</p>', '</p>###').split('###')" :key="index">
            <span
              v-html="phrase"
            />
          </span>
        </div>
        <div
          v-else-if="preview"
          class="document__transcription--content"
          v-html="truncate(transcriptionContent, 399, true)"
        >
        </div>
        <div
          v-else
          class="document__transcription--content"
          v-html="transcriptionContent"
        />
      </div>
    </div>
    <div v-if="!preview">
      <document-notes
        :editable="editable"
        @add-place="addPlace($event, 'note')"
        @add-person="addPerson($event, 'note')"
        @add-note="addNote($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextEditor from "../forms/fields/RichTextEditor";
import EditorSaveButton from "../forms/fields/EditorSaveButton";
import DocumentNotes from "./DocumentNotes";
import escapeRegExp from "lodash/escapeRegExp";

export default {
  name: "DocumentTranscription",
  components: { EditorSaveButton, RichTextEditor, DocumentNotes },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["add-place", "add-person", "add-note"],
  data() {
    return {
      transcriptionContent: "",
      addressContent: "",
      editModeAddress: false,
      editModeTranscription: false
    };
  },

  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm", "documents"])
  },
  mounted() {
    //console.log("this.documents.filter((doc) => doc.id == this.document.id)[0].transcription : ", this.documents.filter((doc) => doc.id == this.document.id)[0].transcription)
    console.log("preview status : ", this.preview)
    if (this.preview && this.documents.length > 0) {
      if (this.documents.filter((doc) => doc.id == this.document.id)[0].transcription !== undefined) {
        this.transcriptionContent = this.documents.filter((doc) => doc.id == this.document.id)[0].transcription.highlight/*.map(function (cc) {	return '<strong>' + cc + '</strong>';}).join('')*/ || "";
        console.log('type(this.transcriptionContent) : ', typeof(this.transcriptionContent))
        } else {
          this.transcriptionContent = this.document.transcription;
          console.log('default this.document.transcription')
        }
    } else {
      this.transcriptionContent = this.document.transcription;
      console.log('default this.document.transcription', this.document.transcription)
    }
    console.log('default this.document.address', this.document.address)
    this.addressContent = this.document.address || "";
  },
  methods: {
    addPlace(evt, source) {
      this.$emit("add-place", {...evt, source});
    },
    addPerson(evt, source) {
      this.$emit("add-person", {...evt, source});
    },
    addNote(evt) {
      console.log("transcription addNote(evt)", evt, {...evt})
      this.$emit("add-note", {...evt});
    },
    truncate(str, n, useWordBoundary) {
      if (str.length <= n) {
        return str;
      }
      const subString = str.slice(0, n - 1);
      return (useWordBoundary
          ? subString.slice(0, subString.lastIndexOf(" "))
          : subString) + " (...)";
    },
    highlight(text) {
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const re = new RegExp(`(${terms.join("|")})`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    },
    enterEditModeAddress() {
      console.log("this.editModeAddress", this.editModeAddress)
      this.editModeAddress = !this.editModeAddress
    },
    enterEditModeTranscription() {
      console.log("this.editModeTranscription", this.editModeTranscription)
      this.editModeTranscription = !this.editModeTranscription
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_document.transcription.scss";
::v-deep em {
   background-color: yellow !important;
}
::v-deep .highlighted:after {
  content: " [...] ";
  font-weight: bold;
}
.document__transcription--content {
  font-size: 18px;
}
.edit-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  .icon.icon__pen-edit {
    display: none;
  }
}
</style>
