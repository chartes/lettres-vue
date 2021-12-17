<template>
  <div class="l-map">
    <l-map ref="map" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" />

      <l-marker :lat-lng="latLng" :icon="redIcon" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LMarker, LTileLayer } from "vue2-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import iconIdle from "../../src/assets/icons/marker-icon-2x-blue.png";
import iconRed from "../../src/assets/icons/marker-icon-2x-red.png";
import iconShadow from "../../src/assets/icons/marker-shadow.png";

const idleIcon = new L.Icon({
  iconUrl: iconIdle,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: iconRed,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default {
  name: "MyAwesomeMap",
  components: {
    LMap,
    LMarker,
    LTileLayer,
  },
  props: {
    latLng: { type: Array, default: () => [] },
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 8,
      center: this.$props.latLng,
      redIcon,
    };
  },
  computed: {},
  created() {
    L.Marker.prototype.options.icon = idleIcon;
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.l-map {
  width: 460px;
  height: 320px;

  background-color: lightgrey;
}
</style>
