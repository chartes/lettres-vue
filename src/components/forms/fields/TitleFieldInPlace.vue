<template>
  <div class="field-title">
    <div
      v-if="editable && editMode"
      ref="hover"
      class="edit-mode-field field field-title__field"
    >
      <div class="control">
        <rich-text-editor
          ref="input"
          v-model="value"
          :multiline="false"
          :formats="formats()"
          :tabindex="tabulationIndex"
          @change="inputChanged"
          @on-keyup-enter="clickSave"
          @on-keyup-escape="cancelInput"
          @add-note="addNote($event)"
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
      class="editable-field field"
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
        <span class="edit-btn">
          <component
            :is="editButtonIcon"
            class="field-title__icon"
          />
        </span>
      </div>
    </div>

    <div v-else>
      <h1
        class="document-title"
        :class="unknownClass"
        v-html="value || notSet"
      />
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
      type: String,
    },
    formats: {
      default: () => [['close'], ["italic", "superscript", "note"]],
      type: Function,
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
    addNote(evt) {
      this.$emit("add-note", { ...evt });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.document-title,
.field-title__input {
  font-family: $family-primary;
  font-size: 30px !important;
  font-weight: 500 !important;
  color: #C00055;
  line-height: 1.2;

  @include on-tablet {
    font-size: $font-size-title-tablet !important;
  }

  @include on-small-mobile {
    font-size: $font-size-title-mobile !important;
  }
}

.editable-field {
  .control {
    display: flex;
    flex-direction: row-reverse;

    .edit-btn {
      position: unset;
      flex: 55px 0 0;

      display: inline-block;
      width: 25px;
      height: 25px;
      background: url(../../../assets/images/icons/bouton_edit.svg) center / 20px auto no-repeat !important;
      cursor: pointer;

      @include on-mobile {
        flex: 45px 0 0;
      }

      .icon.icon__pen-edit {
        display: none;
      }
    }
  }
}

.edit-mode-field {

}


</style>
