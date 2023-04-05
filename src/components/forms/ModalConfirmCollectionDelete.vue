<template>
  <modal-confirm
    :title="'Suppression'"
    :submit-text="'OUI'"
    :cancel-text="'NON'"
    :cancel="cancelAction"
    :submit="submitAction"
    class="has-text-danger"
  >
    <p>Voulez-vous supprimer la (sous) collection : </p>
    <p>{{this.collectionTitle}}</p>
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
    collectionTitle: {type: String, required: true}
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
