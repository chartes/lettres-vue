<template>
  <div
    v-if="$attrs.place && $attrs.place.label"
    class="place-info-card"
  >
    <div class="place-info-card-title">
      Données pour la sauvegarde :
    </div>
    <div class="labels">
      <div class="heading is-size-5">
        {{ $attrs.place.label }}
      </div>
      <div
        v-if="$attrs.place.description"
        class="heading is-size-5"
      />
      {{ $attrs.place.description }}
    </div>
    <div v-if="$attrs.place.coords">
      <my-awesome-map
        :key="$attrs.place.label+$attrs.place.activeTab"
        :lat-lng="$attrs.place.coords"
      />
    </div>
  </div>
</template>

<script>
import MyAwesomeMap from "@/components/MyAwesomeMap.vue";

export default {
  name: "PlaceInfoCard",
  components: {
    MyAwesomeMap,
  },
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
.place-info-card {
  display: flex;
  flex-direction: column;

  .place-info-card-title {
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
  width: 290px;
  height: 280px;
}
</style>
