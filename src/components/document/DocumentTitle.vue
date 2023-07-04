<template>
  <div
    v-if="document.title && document.title.length || editable > 0"
    class="document-title__component"
  >
    <div>
      <header v-if="!preview">
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
          @on-keyup-escape="cancelInput($event)"
        />
      </header>
      <!--<rich-text-editor
        v-if="editable && editMode"
        v-model="form"
        :editable="editable && editMode"
        :formats="[['italic', 'superscript'], ['note']]"
        @changed="titleChanged"
        @add-note="addNote($event)"
        @on-keyup-escape="cancelInput($event)"
      >
          <editor-save-button
            :doc-id="document.id"
            name="title"
            :value="form"
          />
        </rich-text-editor>-->
    <!--</header>
    <header v-if="!preview">
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
        v-html="document.title">
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TitleFieldInPlace from "../forms/fields/TitleFieldInPlace";
// switch TitleFieldInPlace to RichTextEditor : import EditorSaveButton from "@/components/forms/fields/EditorSaveButton.vue";
// switch TitleFieldInPlace to RichTextEditor : import RichTextEditor from "@/components/forms/fields/RichTextEditor.vue";
import escapeRegExp from "lodash/escapeRegExp";

export default {
  name: "DocumentTitle",
  components: {TitleFieldInPlace }, //switch TitleFieldInPlace to RichTextEditor : RichTextEditor, EditorSaveButton
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
  },
  emits: ["add-note"],
  data() {
    return {
      titleStatus: "normal",
    };
  },
  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm"])
  },
  created() {
    console.log("this.searchTerm : ", this.searchTerm)
  },
  methods: {
    cancelInput(evt) {
      console.log("Title event ", { ...evt });
      this.enterEditMode()
    },
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
@import "@/assets/sass/main.scss";

.document-title__component {
  margin-bottom: 15px;
}
span.edit-btn {
  display: inline-block;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 24px auto no-repeat;
  i {
    display: none;
  }
}
</style>
