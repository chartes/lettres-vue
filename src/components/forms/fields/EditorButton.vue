<template>
  <div class="control">
    <button
      class="button is-small"
      :class="{ selected: selected }"
      :disabled="!active"
      @click="callback(format)"
      v-html="iconSvg"
    />
  </div>
</template>

<script>
import icons from "../../../modules/quill/icons";

export default {
  name: "EditorButton",
  props: {
    selected: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    callback: { type: Function, default: () => {} },
    format: { type: String, default: "" },
  },
  computed: {
    iconClass() {
      return "fa fa-" + this.icon;
    },
    iconSvg() {
      return icons[this.format];
    },
  },
};
</script>

<style scoped></style>
