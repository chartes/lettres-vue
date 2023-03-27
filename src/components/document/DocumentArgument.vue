<template>
  <div
    v-if="document.argument && document.argument.length || editable > 0"
    class="panel mt-5"
  ><!-- (document.argument && document.argument.length) || editable > 0 -->
    <div class="panel-block">
      <rich-text-editor
        v-if="editable"
        v-model="form"
        :enabled="editorEnabled"
        :formats="[
          ['italic', 'superscript'],
          ['person', 'location'],
          ['note', 'link'],
        ]"
        @add-place="addPlace($event, 'argument')"
        @add-person="addPerson($event, 'argument')"
        @add-note="addNote($event)"
      >
        <editor-save-button
          :doc-id="document.id"
          name="argument"
          :value="form"
        />
      </rich-text-editor>
      <div
        v-else-if="preview && searchTerm && highlight(form).includes('mark')"
        class="argument__content"
        v-html="highlight(form)">
      </div>
      <div
        v-else
        class="argument__content"
        v-html="form">
      </div>
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
    }
  },
  emits: ["add-place", "add-person", "add-note"],
  data() {
    return {
      editorEnabled: true,
      form: "",
    };
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm"])
  },
  mounted() {
    this.form = this.document.argument || "";
  },
  created() {
    console.log("this.searchTerm : ", this.searchTerm)
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
    highlight(text) {
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const re = new RegExp(`(${terms.join("|")})`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    },
  },
};
</script>

<style scoped lang="scss">
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
</style>
