<template>
  <div>
    <person-wizard-form :popup-mode="false" />
  </div>
</template>

<script>
import PersonWizardForm from "@/components/forms/wizards/PersonWizardForm.vue";

export default {
  name: "PersonsPages",
  components: {
    PersonWizardForm,
  },
  data() {
    return {
    
    };
  },
  computed: {
   
  },
  mounted() {
    this.$store.dispatch("persons/setPageSize", 20);
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
