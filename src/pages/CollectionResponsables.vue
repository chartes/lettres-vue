<template>
  <div class="collection-user-roles">
    <p>
      Responsable(s) scientifique(s) :
    </p>

    <!-- ### CATHERINE DE MEDICIS ID = 1 ### -->
    <div
      v-if="$props.collectionId === 1"
      class="collection-section-content">
      <p>Olivier Poncet  (École nationale des Chartes - EHESS)</p>
      <p>Matthieu Gellard (INSPE de Paris-Sorbonne Universités)</p>
    </div>

    <!-- ### AUTRES COLLECTIONS NON RENSEIGNEES ### -->

    <div
      v-else
      class="collection-section-content">
      <p>Non renseigné</p>
    </div>

  </div>
</template>
<script>
export default {
  name: "CollectionResponsables",
  props: {
    collectionId: { type: Number, required: true },
  },
}
</script>
<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>