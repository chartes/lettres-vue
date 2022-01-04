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
          component: "PlaceList",
          displayed: true,
        },
        {
          id: "add",
          label: "Nouveau lieu",
          component: "CreatePlaceForm",
          displayed: true,
        },
      ];
    },
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
