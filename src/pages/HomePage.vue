<template>
  <div>
    Home Page <br />

    <placename-wizard-form subtitle="d'expédition" />
  </div>
</template>

<script>
import PlacenameWizardForm from "@/components/forms/wizards/PlacenameWizardForm.vue";

export default {
  name: "HomePage",
  components: {
    PlacenameWizardForm,
  },
  data() {
    return {
      isComponentModalActive: false,
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss"></style>
