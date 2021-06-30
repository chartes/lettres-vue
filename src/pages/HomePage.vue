<template>
  <div>
    Home Page
    <div class="main-form">
      <witness-wizard-form />
    </div>
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
    return {};
  },
};
</script>

<style scoped lang="scss">
.main-form {
  width: 90%;
  height: 80vh;
}
</style>
