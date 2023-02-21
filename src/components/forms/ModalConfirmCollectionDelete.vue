<template>
  <modal-confirm
    :title="'Supprimer la (sous-)collection '+this.collectionId+ '?'"
    :submit-text="'Oui je veux la supprimer'"
    :cancel="cancelAction"
    :submit="submitAction"
    class="has-text-danger"
  >
    <p>Vous êtes sur le point de supprimer la (sous-)collection {{this.collectionId}}.</p>
  </modal-confirm>
</template>

<script>
import ModalConfirm from "./ModalConfirm";

export default {
  name: "ModalConfirmCollectionDelete",
  components: {
    ModalConfirm,
  },
  props: {
    cancel: { type: Function, required: true },
    submit: { type: Function, required: true },
    collectionId: { type: Number, required: true },
  },
  methods: {
    submitAction() {
      console.log("ModalConfirmCollectionDelete submit", this.collectionId);
      this.$props.submit(this.collectionId);
    },
    cancelAction() {
      this.$props.cancel();
    },
  },
};
</script>
