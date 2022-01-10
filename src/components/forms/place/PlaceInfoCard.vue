<template>
  <div
    v-if="$attrs.place && $attrs.place.label"
    class="place-info-card"
  >
    <div class="labels">
      <div
        class="heading is-size-5"
      >
        {{ $attrs.place.label }}
      </div>
      <div
        v-if="$attrs.place.description"
        class="heading is-size-7"
      />
      {{ $attrs.place.description }}
    </div>
    <div v-if="$attrs.place.coords">
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

  .labels {
    padding: 8px;
    border-left: 2px solid $coffee;
    margin-bottom: 20px;
  }
}
.l-map {
  width: 290px;
  height: 280px;
}
</style>
