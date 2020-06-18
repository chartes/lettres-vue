<template>
  <section class="main">
    <nav-bar />
    <section class="section">
      <div class="">
        <div class="columns">
          <div class="column is-one-fifth sidebar-column">
            <side-bar />
          </div>
          <div class="column main-column">
            <slot />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";

export default {
  name: "LayoutDefault",
  components: { NavBar, SideBar },

  computed: {
    ...mapState("user", ["current_user"])
  },

  created() {
    //this.$store.dispatch('user/fetchCurrent');
  }
};
</script>

<style scoped lang="scss">
@import '@/assets/sass/main.scss';

.main {
  background-color: $white-ter;
  height: 100%;
}
.main-column {
    background-color: $white;
}
.sidebar-column {
  
}
.section {
  padding-top: 0;
}
</style>
