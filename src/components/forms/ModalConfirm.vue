<template>
  <div class="modal is-active">
    <div
      class="modal-background"
      @click="cancel"
    />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ title }}
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="cancel"
        />
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer class="modal-card-foot">
        <button
          class="button"
          @click="cancel"
        >
          Annuler
        </button>
        <button
          class="button is-danger"
          @click="submit"
        >
          {{ submitText }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalForm",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    submitText: { type: String, default: "" },
    submit: { type: Function, default: () => {} },
    cancel: { type: Function, default: () => {} },
  },
};
</script>

<style scoped></style>
