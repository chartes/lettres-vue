<template>
  <div class="note-list-parent">
    <ol
      v-if="notes.length"
      class="note-list notes"
    >
      <li
        v-for="note in notes"
        :key="note.id"
      >
        <div
          class="note-item"
          :class="noteItemClass"
        >
          <div
            class="note-item__text"
            v-html="note.content"
          />
          <a
            v-if="editable"
            class="note-item__edit"
            @click="openNoteEdit(note)"
          >
            <icon-pen-edit />
          </a>
          <a
            v-if="editable"
            class="note-item__delete"
            @click="noteId = note.id"
          >
            <icon-bin />
          </a>
        </div>
      </li>
    </ol>

    <modal-confirm-note-delete
      v-if="noteId"
      :note-id="noteId"
      :cancel="cancelNoteDelete"
      :submit="confirmNoteDelete"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  removeContentEditableAttributesFromString,
  removeContentEditableAttributesFromObject,
} from "../../modules/document-helpers";
import IconBin from "../ui/icons/IconBin";
import IconPenEdit from "../ui/icons/IconPenEdit";
import ModalConfirmNoteDelete from "../forms/ModalConfirmNoteDelete";

export default {
  name: "DocumentNotes",
  components: { ModalConfirmNoteDelete, IconPenEdit, IconBin },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["add-note"],
  data() {
    return {
      noteId: null,
    };
  },

  computed: {
    ...mapState("document", ["document", "notes", "witnesses"]),
    noteItemClass() {
      return this.editable ? "note-item--editable" : false;
    },
  },
  methods: {
    confirmNoteDelete(noteId) {
      this.$store.dispatch("document/removeNote", noteId).then((noteId) => {
        this.removeNoteFromDocument(noteId);
        this.removeNoteFromWitnesses(noteId);
        this.cancelNoteDelete();
      });
    },
    cancelNoteDelete() {
      this.noteId = false;
    },
    openNoteEdit(note) {
      this.$emit("add-note", { note });
    },

    removeNoteFromDocument(noteId) {
      const pattern = new RegExp(
        '<a class="note" href="#' + noteId + '">\\[note\\]<\\/a>',
        "mgi"
      );
      const attributes = {};
      let changed = false;
      if (this.transcriptionContent) {
        const docTranscription = removeContentEditableAttributesFromString(
          this.transcriptionContent
        );
        const inTranscription = pattern.test(docTranscription);
        if (inTranscription) {
          attributes.transcription = docTranscription.replace(pattern, "");
          changed = true;
        }
      }
      if (this.addressContent) {
        const docAddress = removeContentEditableAttributesFromString(this.addressContent);
        const inAddress = pattern.test(docAddress);
        if (inAddress) {
          attributes.address = docAddress.replace(pattern, "");
          changed = true;
        }
      }
      if (this.document.title) {
        const docTitle = removeContentEditableAttributesFromString(this.document.title);
        const inTitle = pattern.test(docTitle);
        if (inTitle) {
          attributes.title = docTitle.replace(pattern, "");
          changed = true;
        }
      }
      if (this.document["creation-label"]) {
        const docLabel = removeContentEditableAttributesFromString(
          this.document["creation-label"]
        );
        const inLabel = pattern.test(docLabel);
        if (inLabel) {
          attributes["creation-label"] = docLabel.replace(pattern, "");
          changed = true;
        }
      }
      if (this.document.argument) {
        const docArgument = removeContentEditableAttributesFromString(
          this.document.argument
        );
        const inArgument = pattern.test(docArgument);
        if (inArgument) {
          attributes.argument = docArgument.replace(pattern, "");
          changed = true;
        }
      }
      if (changed) {
        const data = { id: this.document.id, attributes };
        this.$store
          .dispatch("document/save", data)
          .then((response) => {
            if (attributes.transcription)
              this.transcriptionContent = attributes.transcription;
            if (attributes.address) this.addressContent = attributes.address;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    removeNoteFromWitnesses(noteId) {
      const pattern = new RegExp(
        '<a class="note" href="#' + noteId + '">\\[note\\]<\\/a>',
        "gi"
      );
      this.witnesses.forEach((wit, index) => {
        const w = { ...wit };
        removeContentEditableAttributesFromObject(w);
        const inContent = pattern.test(w.content);
        const inClassification = pattern.test(w["classification-mark"]);
        let changed = false;
        if (inContent) {
          w.content = w.content.replace(pattern, "");
          changed = true;
        }
        if (inClassification) {
          w["classification-mark"] = w["classification-mark"].replace(pattern, "");
          changed = true;
        }
        if (changed) {
          this.$store
            .dispatch("document/updateWitness", w)
            .then((response) => {})
            .catch((err) => {
              console.error(err);
            });
        }
      });
    },
  },
};
</script>

<style scoped>

.note-list-parent {
  border-top: solid 1px #ccc;
}

</style>
