<template>
  <modal-confirm
    :title="'Supprimer le document '+this.docId+ '?'"
    :submit-text="'Oui je veux le supprimer'"
    :cancel="cancelAction"
    :submit="submitAction"
    class="has-text-danger"
  >
    <p>Vous êtes sur le point de supprimer le document {{this.docId}}.</p>
  </modal-confirm>
</template>

<script>
import ModalConfirm from "./ModalConfirm";

export default {
  name: "ModalConfirmDocumentDelete",
  components: {
    ModalConfirm,
  },
  props: {
    cancel: { type: Function, required: true },
    submit: { type: Function, required: true },
    docId: { type: Number, required: true },
  },
  methods: {
    submitAction() {
      console.log("ModalConfirmDocumentDelete submit", this.docId);
      this.$props.submit(this.docId);
    },
    cancelAction() {
      this.$props.cancel();
    },
  },
};
</script>
