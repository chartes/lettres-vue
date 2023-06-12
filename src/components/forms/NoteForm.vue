<template>
  <div class="modal-card note-form">
    <header class="is-uppercase is-size-2 mb-5">
      <h1>{{ $attrs.title }}</h1>
    </header>
    <div class="editor">
      <rich-text-editor
        v-model="form.content"
        :formats="[
          ['bold', 'italic', 'superscript', 'underline', 'del'],
          ['link', 'person', 'location', 'cite'],
        ]"
        @add-place="addPlace($event, 'note')"
        @add-person="addPerson($event, 'note')"
      />
    </div>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-medium"
        @click="cancelAction"
      >
        Annuler
      </b-button>
      <b-button
        type="is-primary"
        size="is-medium"
        @click="submitAction"
      >
        Sauvegarder
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NoteForm",
  components: {
  },
  props: {
      inputData: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  emits: ["add-place", "add-person", "close"],
  data() {
    return {
      form: {},
      textLength: 0,
      loading: false,
    };
  },
  computed: {
    isValid() {
      console.log("isValid", !!this.form && !!this.form.content && this.form.content.length > 1)
      return !!this.form && !!this.form.content && this.form.content.length > 1;
    },
  },
  beforeCreate: function () {
    this.$options.components.RichTextEditor = require("./fields/RichTextEditor").default;
  },
  mounted() {
    // check if triggered from notes list (this.inputData.note) or existing note in editor (this.inputData.formats.note) :
    if (this.inputData.note || this.inputData.formats.note) {
      if (this.inputData.note) {
        console.log("NoteForm mounted inputData : ", this.inputData)
        this.form = {...this.inputData.note}
      } else {
        console.log("NoteForm mounted inputData (existing note) : ", this.inputData)
        // retrieve note if from inputData
        this.form.id = parseInt(this.inputData.formats.note.id);
        // retrieve note content from store
        let existingNote = this.$store.state.document.notes.filter((note) => parseInt(note.id) === parseInt(this.form.id))[0];
        console.log("existingNote : ", existingNote);
        this.form.content = existingNote.content;
      }
    }
  },
  methods: {
    ...mapState("document", ["document"]),
    submitAction() {
      this.loading = true;
      const action = this.form && this.form.id ? "document/updateNote" : "document/addNote";
      console.log("submitAction : action / this.form", action, this.form)
      this.$store.dispatch(action, this.form).then((storeNote) => {
        if (action === "document/addNote") {
          console.log("NoteForm / submitAction / addNote", storeNote);
          let noteIndex = this.$store.state.document.notes.findIndex(n => n.id === storeNote.id) + 1;
          this.inputData.insertTagCallback({id: storeNote.id, index: noteIndex});
        } else if (action === "document/updateNote") {
            console.log("NoteForm / submitAction / Update Note", storeNote);
          let existingNote = storeNote.content;
          this.form.content = existingNote;
        }
        this.$emit("close");
      });
    },
    cancelAction() {
      this.$emit("close");
    },
    addPlace(evt, source) {
      this.$emit("add-place", { ...evt, source });
    },
    addPerson(evt, source) {
      this.$emit("add-person", { ...evt, source });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.note-form {
  overflow: visible;
  padding-bottom: 20px;

  header {
    background-color: #CB2158;
    border: none;
    border-radius: 5px;
    padding: 3px 20px;
    margin-bottom: 10px !important;

    h1 {
      padding: 0;
      font-family: $family-apptitle;
      font-size: 30px;
      color: #FFFFFF;
      font-weight: 200;
      letter-spacing: 0;
      text-transform: none;
    }
  }

  .editor {
    background-color: #FFFFFF;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 20px;
  }

  .buttons {
    display: flex;
    justify-content: end;
    background-color: #FFFFFF;
    padding: 20px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    .button {
      background-color: #CB2158;
    }
  }
}
</style>
