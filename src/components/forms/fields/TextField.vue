<template>
  <div class="field-text">
    <field-label :label="label" />

    <div class="field field-text__field">
      <div class="control">
        <input
          ref="field"
          class="input field-text__input"
          :type="type"
          :maxlength="maxlength"
          :minlength="minlength"
          :pattern="pattern"
          :placeholder="placeholder"
          :readonly="readonly"
          :size="size"
          :spellcheck="spellcheck"
          :required="required"
          :value="value"
          :tabindex="tabindex"
          :disabled="disabled"
          @input="updateField"
        >
      </div>
    </div>
  </div>
</template>

<script>
import FieldLabel from "./FieldLabel";
export default {
  name: "TextField",
  components: { FieldLabel },
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    maxlength: { type: String, default: null },
    minlength: { type: String, default: null },
    pattern: { type: String, default: null },
    placeholder: { type: String, default: null },
    readonly: { type: Boolean, default: false },
    size: { type: Number, default: null },
    spellcheck: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    tabindex: { type: Number, default: null },
    disabled: { type: Boolean, default: false },
  },
  methods: {
    updateField() {
      this.$emit("input", this.$refs.field.value);
    },
  },
};
</script>

<style scoped></style>
