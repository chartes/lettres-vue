<template>
  <div>
    Home Page <br />
    <b-button
      label="Ajouter un témoin"
      type="is-primary"
      size="is-medium"
      @click="isComponentModalActive = true"
    />

    <b-modal
      v-model="isComponentModalActive"
      trap-focus
      has-modal-card
      scroll="clip"
      :width="1080"
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <template #default="props">
        <witness-wizard-form @close="props.close" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import WitnessWizardForm from "@/components/forms/wizards/WitnessWizardForm";

export default {
  name: "HomePage",
  components: {
    WitnessWizardForm,
  },
  data() {
    return {
      isComponentModalActive: false,
    };
  },
};
</script>

<style scoped lang="scss"></style>
