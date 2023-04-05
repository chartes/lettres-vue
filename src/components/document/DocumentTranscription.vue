<template>
  <div class="document__transcription">
    <div class="panel">
      <div
        v-if="!preview"
        class="panel-block"
        style="display: inline-block; width: 100%"
      >
        <h3 class="heading mt-3">
          Adresse
        </h3>

        <rich-text-editor
          v-if="editable"
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
        <rich-text-editor
          v-if="editable"
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
          v-else-if="preview && searchTerm && highlight(transcriptionContent).includes('mark')"
          class="document__transcription--content">
          <div class="document__transcription--content">
            <span v-for="(phrase, index) in highlight(transcriptionContent).replaceAll('</p>', '</p>###').split('###')" :key="index">
              <span
                v-html="phrase"
              />
            </span>
          </div>
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
    };
  },

  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm"])
  },
  mounted() {
    this.transcriptionContent = this.document.transcription || "";
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_document.transcription.scss";
</style>
