<template>
  <div>
    Place page

    <place-list />
  </div>
</template>

<script>
import PlaceList from "@/components/sections/PlaceList.vue";

export default {
  name: "PlacePages",
  components: {
    PlaceList,
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
