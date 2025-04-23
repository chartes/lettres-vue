<template>
  <div>
    <person-wizard-form :popup-mode="false" />
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";
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
    ...mapState("persons", {statePersons: "documents", stateRoles: "roles"})
  },
  async mounted() {
    this.$store.dispatch("persons/setPageSize", 20);
    if (!this.statePersons || !this.statePersons.length) {
      await this.performSearch
    }
    if (!this.stateRoles || !this.stateRoles.length) {
      await this.$store.dispatch("persons/fetchRoles")
    }
  },
  methods: {
    ...mapActions("persons", ["performSearch"]),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
