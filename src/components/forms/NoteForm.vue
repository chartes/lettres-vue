<template>
  <div class="modal-card note-form">
    <header class="is-uppercase is-size-2 mb-5">
      {{ $attrs.title }}
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
  border-radius: 3px;
  background-color: white;
  
  header {
    font-family: $bitter-family;
    background-color: $light !important;

    padding: 2px 20px 2px;
    border-bottom: 1px solid $coffee;
  }

  .editor {
    padding: 20px;  
  }

  .buttons {
    display: flex;
    justify-content: end;
    margin: 20px 20px 10px 20px;
  }
}
</style>
