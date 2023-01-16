<template>
  <button
    class="delete-button button"
    :class="buttonClass"
    @click.prevent="clickHandler"
  >
    <delete-button-icon :status="status" />
    &nbsp; {{ statusText }}
  </button>
</template>

<script>
import DeleteButtonIcon from "./DeleteButtonIcon";
export default {
  name: "DeleteButton",
  components: { DeleteButtonIcon },
  props: {
    status: {
      type: String,
      default: "normal",
    },
    text: {
      type: String,
      default: "Supprimer",
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
          cssClass = "is-loading disabled";
          break;
        case "error":
          cssClass = "disabled disabled";
          break;
      }
      return cssClass;
    },
    statusText() {
      if (this.status === "loading") {
        return "Suppression...";
      } else if (this.status === "error") {
        return "Erreur";
      } else if (this.status === "success") {
        return "Supprimé";
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
