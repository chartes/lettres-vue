<template>
  <button
    class="save-button button"
    :class="buttonClass"
    @click.prevent="clickHandler"
  >
    <save-button-icon :status="status" />
    &nbsp; {{ statusText }}
  </button>
</template>

<script>
import SaveButtonIcon from "./SaveButtonIcon";
export default {
  name: "SaveButton",
  components: { SaveButtonIcon },
  props: {
    status: {
      type: String,
      default: "normal",
    },
    text: {
      type: String,
      default: "Enregistrer",
    },
    action: {
      type: Function,
      required: true,
    },
  },
  computed: {
    buttonClass() {
      let cssClass;
      switch (this.status) {
        case "normal":
          cssClass = "is-primary";
          break;
        case "working":
          cssClass = "is-loading disabled save-bar__working";
          break;
        case "success":
          cssClass = "disabled disabled save-bar__message has-text-success";
          break;
        case "error":
          cssClass = "disabled disabled save-bar__error has-text-danger";
          break;
      }
      return cssClass;
    },
    statusText() {
      if (this.status === "loading") {
        return "Enregistrement...";
      } else if (this.status === "error") {
        return "Erreur";
      } else if (this.status === "success") {
        return "Enregistrement terminé";
      }
      return this.text;
    },
  },
  methods: {
    clickHandler() {
      this.$el.blur();
      this.action();
    },
  },
};
</script>

<style scoped>
button.disabled {
  pointer-events: none;
}
</style>
