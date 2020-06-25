<template>
  <div>
    Places page
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

export default {
    name: "PlacesPage",
    components: {
    },
    mounted() {
      this.hideRightSideBar();
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";


</style>