<template>
  <div>
    Home Page <br />

    <place-wizard-form subtitle="d'expédition" :popup-mode="true" />
  </div>
</template>

<script>
import PlaceWizardForm from "@/components/forms/wizards/PlaceWizardForm.vue";

export default {
  name: "HomePage",
  components: {
    PlaceWizardForm,
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
