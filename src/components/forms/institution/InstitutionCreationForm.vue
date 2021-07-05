<template>
  <div class="wizard-center-form">
    <b-field label="Nom de l'institution *">
      <b-input v-model="name" placeholder="Paris, Bibl. nat. Fr." />
    </b-field>
    <b-field label="Identifiant de référence">
      <b-input v-model="idRef" placeholder="https://data.bnf.fr/ark:/12148/cb123351707" />
    </b-field>

    <b-button type="is-primary is-pulled-right" :disabled="!name" @click="addInstitution">
      Ajouter
    </b-button>
  </div>
</template>

<script>
export default {
  name: "InstitutionTextInputForm",
  emits: ["manage-witness-data", "goto-wizard-step"],
  data() {
    return {
      name: null,
      idRef: null,
    };
  },
  watch: {},
  methods: {
    manageWitnessData(evt) {
      this.$emit("manage-witness-data", evt);
    },
    updateWitness() {
      this.manageWitnessData({
        action: { name: "set-institution" },
        data: { name: this.name, ref: this.idRef },
      });
    },
    addInstitution() {
      this.updateWitness();
      this.$emit("goto-wizard-step", "classification");
    },
  },
};
</script>

<style lang="scss" scoped>
.wizard-center-form {
  padding-top: 75px;
  padding-left: 12px;
  width: 80%;
}
</style>
