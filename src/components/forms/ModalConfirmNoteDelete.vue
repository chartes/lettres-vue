<template>
  <modal-confirm
    :title="'Supprimer la note ?'"
    :submit-text="'Oui je veux la supprimer'"
    :cancel="cancelAction"
    :submit="submitAction"
    class="has-text-danger"
  >
    <p>Vous êtes sur le point de supprimer une note.</p>
  </modal-confirm>
</template>

<script>

    import ModalConfirm from './ModalConfirm';

  export default {
    name: "MmodalConfirmNoteDelete",
    components: {
      ModalConfirm
    },
    props: ['cancel', 'submit', 'noteId'],
    methods: {
      submitAction () {
        console.log("MmodalConfirmNoteDelete submit", this.noteId)
        this.$props.submit(this.noteId);
      },
      cancelAction () {
        this.$props.cancel();
      }
    }
  }
</script>
