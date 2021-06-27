<template>
  <div class="wizard-center-form">
    <b-field label="Nom de l'institution">
      <b-input v-model="name" />
    </b-field>
    <b-field label="Identifiant de référence">
      <b-input v-model="idRef" />
    </b-field>
  </div>
</template>

<script>
export default {
  name: "InstitutionTextInputForm",
  data() {
    return {
      name: null,
      idRef: null
    }
  }
};
</script>


<style lang="scss" scoped>
    .wizard-center-form {
      padding-top: 75px;
      width: 80%;
    }
</style>