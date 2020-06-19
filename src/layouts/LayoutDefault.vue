<template>
  <section class="main">
    <nav-bar />
    <section
      class="section"
      style="height: 100%"
    >
      <div class="columns">
        <div class="column is-2 sidebar-column">
          <side-bar />
        </div>
        <div class="column main-column">
          <slot />
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
          is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
        </p>
      </div>
    </footer>
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
.columns {
  display: flex;
  height: 100%;
  min-height: 100vh;
}
.main {
  background-color: $white-ter;
  min-height: 100%;
}
.sidebar-column {
  padding-left: 30px;
}
.main-column {
  background-color: $white;
  padding: 30px;
}
.section {
  padding: 0
}
.footer {
    background-color: lightgrey;
    margin-top:12px;
}
</style>
