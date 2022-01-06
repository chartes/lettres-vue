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
      activeTab: "search",
      multiline: true,
    };
  },
  computed: {
    tabs() {
      return [
        {
          id: "search",
          label: "Référentiel de l'application",
          component: "PersonList",
          displayed: true,
        },
        {
          id: "add",
          label: "Nouvelle Person",
          component: "CreatePersonForm",
          displayed: true,
        },
      ];
    },
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
