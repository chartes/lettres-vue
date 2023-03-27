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
          v-else-if="preview"
          class="document__transcription--content"
          v-html="truncate(transcriptionContent, 399, true)"
        />
        <div
          v-else
          class="document__transcription--content"
          v-html="transcriptionContent"
        />
      </div>
    </div>

    <document-notes
      :editable="editable"
      @add-place="addPlace($event, 'note')"
      @add-person="addPerson($event, 'note')"
      @add-note="addNote($event)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextEditor from "../forms/fields/RichTextEditor";
import EditorSaveButton from "../forms/fields/EditorSaveButton";
import DocumentNotes from "./DocumentNotes";

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
  },
  mounted() {
    this.transcriptionContent = this.document.transcription || "";
    this.addressContent = this.document.address || "";
  },
  methods: {
    addPlace(evt, source) {
      this.$emit("add-place", { ...evt, source });
    },
    addPerson(evt, source) {
      this.$emit("add-person", { ...evt, source });
    },
    addNote(evt) {
      this.$emit("add-note", { ...evt });
    },
    truncate(str, n, useWordBoundary){
      if (str.length <= n) { return str; }
      const subString = str.slice(0, n-1);
      return (useWordBoundary
        ? subString.slice(0, subString.lastIndexOf(" "))
        : subString) + " (...)";
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_document.transcription.scss";
</style>
