<template>
  <div>
    <place-wizard-form :popup-mode="false" />
  </div>
</template>

<script>
import PlaceWizardForm from "@/components/forms/wizards/PlaceWizardForm.vue";

export default {
  name: "PlacePages",
  components: {
    PlaceWizardForm,
  },
  data() {
    return {
     
    };
  },
  computed: {
   
  },
  mounted() {
    this.$store.dispatch("placenames/setPageSize", 20);
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
