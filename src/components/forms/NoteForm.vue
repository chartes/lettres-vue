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
      return !!this.form && !!this.form.content && this.form.content.length > 1;
    },
  },
  beforeCreate: function () {
    this.$options.components.RichTextEditor = require("./fields/RichTextEditor").default;
  },
  mounted() {
    if (this.inputData.note) {
      this.form = {...this.inputData.note}
    }
  },
  methods: {
    submitAction() {
      this.loading = true;
      const action = this.form && this.form.id ? "document/updateNote" : "document/addNote";
      this.$store.dispatch(action, this.form).then((note) => {
        if (action === "document/addNote") {
          this.inputData.insertTagCallback(note.id);
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
