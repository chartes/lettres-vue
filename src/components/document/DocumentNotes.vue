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
    transcriptionEditor: {
      type: String,
      default: "",
    },
    addressEditor: {
      type: String,
      default: "",
    },
    titleEditor: {
      type: String,
      default: "",
    },
    argumentEditor: {
      type: String,
      default: "",
    },
  },
  emits: ["add-note", "refresh-title", "refresh-argument", "refresh-transcription", "refresh-address"],
  data() {
    return {
      noteId: null,
      noteWithMode: false,
      titleContent:"",
      argumentContent:"",
      transcriptionContent: "",
      addressContent: "",
    };
  },
  watch: {
     titleEditor: function() {
       this.titleContent = this.titleEditor;
     },
     argumentEditor: function() {
       this.argumentContent = this.argumentEditor;
     },
     transcriptionEditor: function(val) {
       console.log("DocumentNotes / watch / transcriptionEditor props", val)
       this.transcriptionContent = this.transcriptionEditor;
     },
     addressEditor: function() {
       this.addressContent = this.addressEditor;
     },
  },
  mounted() {
    this.titleContent = this.$props.titleEditor;
    console.log("DocumentNotes / mounted / this.$props.titleEditor", this.$props.titleEditor)
    console.log("DocumentNotes / mounted / this.titleContent", this.titleContent)
    this.argumentContent = this.$props.argumentEditor;
    console.log("DocumentNotes / mounted / this.$props.argumentEditor", this.$props.argumentEditor);
    this.transcriptionContent = this.$props.transcriptionEditor;
    console.log("DocumentNotes / mounted / this.transcriptionContent", this.transcriptionContent)
    this.addressContent = this.$props.addressEditor;
    console.log("DocumentNotes / mounted / this.addressContent", this.addressContent)
  },
  computed: {
    ...mapState("document", ["document", "notes", "witnesses"]),
    noteItemClass() {
      return this.editable ? "note-item--editable" : false;
    },
  },
  methods: {
    confirmNoteDelete(noteIdToDelete) {
      console.log("confirmNoteDelete(noteId)", noteIdToDelete)
      let noteToDeleteIndex = this.$store.state.document.notes.findIndex(n => n.id === noteIdToDelete);
      let notesToRenumber = this.$store.state.document.notes.filter((_, index) => index > noteToDeleteIndex);
      if (notesToRenumber.length === 0) {
        this.$store.dispatch("document/removeNote", noteIdToDelete).then((noteIdToDelete) => {
        this.inputData.removeTagCallback();
        //this.removeNoteFromWitnesses(noteIdToDelete);
        this.cancelNoteDelete();
        });
      } else {
          this.$store.dispatch("document/removeNote", noteIdToDelete).then((noteIdToDelete) => {
            this.removeNoteFromDocument(noteIdToDelete, notesToRenumber);
            //this.inputData.removeTagCallback();
            //this.removeNoteFromWitnesses(noteIdToDelete);
            this.cancelNoteDelete();
        });
      }
    },
    cancelNoteDelete() {
      this.noteId = false;
    },
    openNoteEdit(note) {
      console.log("DocumentNotes / openNoteEdit / note", note)
      this.noteWithMode = {note: note};
      this.noteWithMode.action = "update";
      this.$emit("add-note", this.noteWithMode);
    },
    removeNoteFromDocument(noteId, notesToRenumber) {
      const pattern = new RegExp(
        '<a class="note" href="#' + noteId + '">\\[\\d+]<\\/a>',
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
          if (notesToRenumber) {
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
        '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
          "mgi"
              );
              const renumberInTranscription = patternRenumber.test(attributes.transcription);
              if (renumberInTranscription) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.transcription = attributes.transcription.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-transcription", attributes.transcription);
        } else {
          if (notesToRenumber) {
            attributes.transcription = docTranscription;
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
        '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
          "mgi"
              );
              const renumberInTranscription = patternRenumber.test(attributes.transcription);
              if (renumberInTranscription) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.transcription = attributes.transcription.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-transcription", attributes.transcription);
        }
      }
      if (this.addressContent) {
        const docAddress = removeContentEditableAttributesFromString(this.addressContent);
        const inAddress = pattern.test(docAddress);
        if (inAddress) {
          attributes.address = docAddress.replace(pattern, "");
          if (notesToRenumber) {
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
                  '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
                  "mgi"
              );
              const renumberInAddress = patternRenumber.test(attributes.address);
              if (renumberInAddress) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.address = attributes.address.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-address", attributes.address);
        } else {
          if (notesToRenumber) {
            attributes.address = docAddress;
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
        '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
          "mgi"
              );
              const renumberInAddress = patternRenumber.test(attributes.address);
              if (renumberInAddress) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.address = attributes.address.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-address", attributes.address);
        }
      }
      if (this.titleContent) {
        const docTitle = removeContentEditableAttributesFromString(this.titleContent);
        const inTitle = pattern.test(docTitle);
        if (inTitle) {
          attributes.title = docTitle.replace(pattern, "");
          if (notesToRenumber) {
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
                  '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
                  "mgi"
              );
              const renumberInTitle = patternRenumber.test(attributes.title);
              if (renumberInTitle) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.title = attributes.title.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-title", attributes.title);
        } else {
          if (notesToRenumber) {
            attributes.title = docTitle;
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
                  '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
                  "mgi"
              );
              const renumberInTitle = patternRenumber.test(attributes.title);
              if (renumberInTitle) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.title = attributes.title.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-title", attributes.title);
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
      if (this.argumentContent) {
        const docArgument = removeContentEditableAttributesFromString(
          this.argumentContent
        );
        const inArgument = pattern.test(docArgument);
        if (inArgument) {
          attributes.argument = docArgument.replace(pattern, "");
          if (notesToRenumber) {
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
                  '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
                  "mgi"
              );
              const renumberInArgument = patternRenumber.test(attributes.argument);
              if (renumberInArgument) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.argument = attributes.argument.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-argument", attributes.argument)
        } else {
          if (notesToRenumber) {
            attributes.argument = docArgument;
            notesToRenumber.forEach(n => {
              const patternRenumber = new RegExp(
                  '<a class="note" href="#' + n.id + '">\\[\\d+]<\\/a>',
                  "mgi"
              );
              const renumberInArgument = patternRenumber.test(attributes.argument);
              if (renumberInArgument) {
                let newNoteIndex = this.$store.state.document.notes.findIndex(note => note.id === n.id) + 1;
                attributes.argument = attributes.argument.replace(patternRenumber, `<a class="note" href="#${n.id}">[${newNoteIndex}]</a>`);
              }
            })
          }
          changed = true;
          this.$emit("refresh-argument", attributes.argument);
        }
      }
      if (changed) {
        const data = { id: this.document.id, attributes };
        this.$store
          .dispatch("document/save", data)
          .then((response) => {
            if (attributes.transcription) {
              this.transcriptionContent = attributes.transcription;
            }
            if (attributes.address) {
              this.addressContent = attributes.address;
              console.log("attributes.address changed")
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    removeNoteFromWitnesses(noteId) {
      const pattern = new RegExp(
        '<a class="note" href="#' + noteId + '">\\[\\d+]<\\/a>',
        "gi"
      );//<a class="note" href="#' + noteId + '">\\[note\\]<\\/a>'
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
  /* border-top: solid 1px #ccc; */
}

</style>
