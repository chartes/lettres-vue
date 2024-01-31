<template>
  <div
    v-if="$attrs.person && $attrs.person.label"
    class="person-info-card"
  >
    <div class="person-info-card-title">
      Données pour la sauvegarde :
    </div>
    <div class="labels">
      <div class="heading is-size-5">
        {{ $attrs.person.label }}
      </div>
      <div
        v-if="$attrs.person.description"
        class="heading is-size-5"
      >
        {{ $attrs.person.description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonInfoCard",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.label {
  color: inherit !important;
}
.person-info-card {
    display: flex;
    flex-direction: column;
  .person-info-card-title {
    font-weight: bold;
  }
  .labels {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;
  }
}
.l-map {
  max-width: 100%;
  width: 270px;
  height: 280px;
}
</style>
