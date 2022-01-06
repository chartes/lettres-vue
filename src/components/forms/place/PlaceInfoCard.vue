<template>
  <div class="place-info-card">
    <div
      v-if="$attrs.place"
      class="heading is-size-5"
    >
      {{ $attrs.place.label }}
    </div>
    <div
      v-if="$attrs.place && $attrs.place.description"
      class="heading is-size-7"
    >
      {{ $attrs.place.description }}
    </div>
    <div v-if="$attrs.place && $attrs.place.coords">
      <my-awesome-map
        :key="$attrs.place.label"
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
  font-family: "Bitter", sans-serif;
  color: $nice-blue;
}
.l-map {
  width: 270px;
  height: 280px;
}
</style>
