<template>
  <div class="field-title">
    <div v-if="editable && editMode" ref="hover" class="field field-title__field">
      <div class="control">
        <rich-text-editor
          ref="input"
          v-model="value"
          :multiline="false"
          :formats="[['italic', 'superscript', 'note']]"
          :tabindex="tabulationIndex"
          @change="inputChanged"
          @on-keyup-enter="clickSave"
          @on-keyup-escape="cancelInput"
        >
          <button
            class="button is-small"
            :class="saveButtonClass"
            :disabled="status === 'disabled'"
            @click="clickSave"
          >
            <component :is="saveButtonIcon" />
          </button>
        </rich-text-editor>
      </div>
    </div>

    <div
      v-else-if="editable && !editMode"
      ref="hover"
      class="field"
      :tabindex="tabulationIndex"
      @click="enterEditMode"
      @mouseover="overField"
      @mouseout="outField"
    >
      <div class="control">
        <span
          class="field-title__input--fake"
          :class="userClass"
          v-html="value || notSet"
        />
        <component :is="editButtonIcon" class="field-title__icon" />
      </div>
    </div>

    <div v-else>
      <h1 class="document-title" :class="unknownClass" v-html="value || notSet" />
    </div>
  </div>
</template>

<script>
import FieldLabel from "./FieldLabel";
import TextFieldMixins from "./TextFieldMixins";
import RichTextEditor from "./RichTextEditor";
import IconSave from "../../ui/icons/IconSave";
import IconPenEdit from "../../ui/icons/IconPenEdit";
import IconError from "../../ui/icons/IconError";
import IconSuccess from "../../ui/icons/IconSuccess";
export default {
  name: "TitleFieldInPlace",
  components: {
    IconSuccess,
    IconError,
    IconSave,
    RichTextEditor,
    IconPenEdit,
    FieldLabel,
  },
  mixins: [TextFieldMixins],
  props: {
    status: {
      validator: function (value) {
        return (
          ["normal", "success", "error", "loading", "disabled"].indexOf(value) !== -1
        );
      },
      default: "normal",
    },
    specificClass: {
      default: null,
    },
  },
  computed: {
    saveButtonClass() {
      switch (this.status) {
        case "normal":
        case "disabled":
          return "is-success";
        case "success":
          return "is-success";
        case "error":
          return "is-danger";
        case "loading":
          return "is-loading";
        default:
          return "is-danger";
      }
    },
    saveButtonIcon() {
      switch (this.status) {
        case "normal":
        case "loading":
        case "disabled":
          return IconSave;
        case "success":
          return IconSuccess;
        case "error":
          return IconError;
        default:
          return IconError;
      }
    },
    userClass() {
      return this.$props.specificClass ? this.$props.specificClass : "";
    },
  },
  watch: {
    initialValue(val, oldVal) {
      this.value = val;
    },
    status(val) {
      if (val === "success") {
        this.exitEditMode(true);
      }
    },
  },
  methods: {
    clickSave() {
      if (this.status === "error" || this.status === "success") return;
      this.$emit("changed", {
        value: this.value,
        name: this.name,
        oldValue: this.initialValue,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.field-title__input {
  font-family: "Bitter", sans-serif;
  font-weight: 500 !important;
  font-size: 32px !important;
  font-variant: small-caps;
}
.document-title {
  font-family: "Bitter", sans-serif;
  font-weight: 500 !important;
  font-size: 32px !important;
  font-variant: small-caps;
}
</style>
