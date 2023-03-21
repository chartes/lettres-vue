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

<style scoped  lang="scss">
@import "@/assets/sass/main.scss";

.modal-background {
  background-color: #D8D8D8CC;
}

.modal-card {
  box-shadow: -6px 6px 30px 0 #00000050;
  min-width: 750px !important;

  .modal-card-head {
    background-color: #CB2158;
    border: none;
    border-radius: 5px;
    padding: 12px 20px;
    margin-bottom: 10px;

    p {
      font-family: $family-apptitle;
      font-size: 30px;
      color: #FFFFFF;
      font-weight: 200;
      letter-spacing: 0;
    }

    button.delete {
      width: 28px;
      height: 28px;
      background: url(../../assets/images/icons/close-modal.svg) center / cover no-repeat;

      &::before,
      &::after {
        display: none;
      }
    }
  }

  .modal-card-body {
    padding-top: 40px;
    padding-bottom: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    p {
      font-family: $family-secondary;
      font-size: 20px;
      color: #CB2158;
      font-weight: 500;
    }
  }

  .modal-card-body,
  .modal-card-foot {
    background-color: #FFFFFF;
    padding-left: 30px;
    padding-right: 30px;
  }

  .modal-card-foot {
    justify-content: flex-end;
    gap: 12px;
    border-top: none;
    padding-top: 20px;
    padding-bottom: 20px;

    button {
      width: auto;
      height: auto;
      background-color: #CB2158;
      border-radius: 5px;
      padding: 6px 10px;
      margin: 0 !important;

      font-family: $family-primary;
      font-size: 18px;
      line-height: 1;
      font-weight: 500;
      color: #FFFFFF;
      letter-spacing: 0;
      text-transform: uppercase;

      &:hover {
        background-color: #CB2158;
        color: #FFFFFF;
      }
    }
  }

  .modal-card-body::after {
    content: "";
    display: block;
    width: 100%;
    margin-top: 80px;
    height: 1px;
    border-top: 1px solid #CB2158;
  }
}

</style>
