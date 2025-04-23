<template>
  <div>
    <place-wizard-form :popup-mode="false" />
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";
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
    ...mapState("placenames", {statePlaces: "documents", stateRoles: "roles"})
  },
  async mounted() {
    this.$store.dispatch("placenames/setPageSize", 20);
    if (!this.statePlaces || !this.statePlaces.length) {
      await this.performSearch
    }
    if (!this.stateRoles || !this.stateRoles.length) {
      await this.$store.dispatch("placenames/fetchRoles")
    }
  },
  methods: {
    ...mapActions("placenames", ["performSearch"])
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
