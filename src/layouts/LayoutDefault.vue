<template>
  <section class="main">
    <nav-bar />
    <section class="section" style="height: 100%">
      <div class="columns">
        <div v-show="showLeftSideBar" class="column is-2">
          <side-bar />
        </div>
        <div
          class="column main-column"
          :style="
            (showLeftSideBar ? 'padding-left: 0;' : '') +
            (rightSideBarIsVisible ? 'padding-right: 0;' : '')
          "
        >
          <div style="display: flex">
            <div
              class="hide-button is-vertical divider-left"
              @click="toggleLeftSideBar"
            />
            <div class="main-column-content">
              <slot />
            </div>
          </div>
        </div>
        <div
          v-show="rightSideBarIsVisible"
          class="column is-5"
          style="background-color: #f6f6f6"
        >
          <mirador-viewer
            v-if="document && displayedManifestUrl"
            class="mirador-container"
            :manifest-url="displayedManifestUrl"
          />
        </div>
      </div>
    </section>
    <footer class="footer">
      <nav class="level">
        <div class="level-item has-text-centered">
          <span
            class="cths-logo mr-5 pt-3"
            v-html="
              require('@/assets/images/logos/Comité_des_travaux_historiques_et_scientifiques_logo.svg')
            "
          />
          <img
            class="enc-logo ml-5 pt-3"
            src="@/assets/images/logos/logo-ecole-nationale-des-chartes-header.png"
          />
        </div>
      </nav>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";

export default {
  name: "LayoutDefault",
  emit: ["refresh-viewer"],
  components: {
    NavBar,
    SideBar,
    MiradorViewer: () => import("@/components/MiradorViewer"),
  },

  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", [
      "showLeftSideBar",
      "showRightSideBar",
      "displayedManifestUrl",
    ]),
    ...mapState("document", ["document", "witnesses"]),

    rightSideBarIsVisible() {
      return this.showRightSideBar;
    },
  },
  watch: {
    displayedManifestUrl() {
      if (!this.displayedManifestUrl) {
        this.hideRightSideBar();
      } else {
        //this.$emit("refresh-viewer");
      }
    },
    "document.id"() {
      this.setDisplayedManifestUrl(null);
    },
    witnesses() {
      this.$emit("refresh-viewer");
    },
    showRightSideBar() {
      if (this.showRightSideBar) {
        this.$emit("refresh-viewer");
      }
    },
  },
  created() {},
  methods: {
    ...mapActions("layout", [
      "toggleLeftSideBar",
      "toggleRightSideBar",
      "hideRightSideBar",
      "setDisplayedManifestUrl",
    ]),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.columns {
  display: flex;
  height: 100%;
  min-height: 100vh;
  margin-bottom: 0;
  margin-top: 0;
}
.column {
  margin-top: 0;
  padding-top: 0;
  &.is-2,
  &.is-5 {
    padding-left: 0;
    padding-right: 0;
    background-color: $beige-lighter;
  }
}
.main {
  min-height: 100%;
}
.main-column {
  background-color: $beige-lighter;
  padding-bottom: 0;
}
.main-column-content {
  padding: 18px;
  width: 100%;
  background-color: white;
}
.hide-button {
  width: 15px;
  min-height: 100vh;
  background-color: $beige-lighter;
  border: 1px solid;
  border-top: none;
  border-bottom: none;
  &:hover {
    background-color: lightgrey;
    cursor: pointer;
  }
  &.divider-left {
    padding-left: 25px;
    border-right-color: $nice-grey;
    border-left: none;
  }
  &.divider-right {
    padding-right: 25px;
    border-left-color: $nice-grey;
    border-right: none;
  }
}

.section {
  padding: 0;
}
footer {
  background-color: $nice-grey !important;
  margin-top: 12px;
  padding: 15px 0px 25px !important;
  z-index: 100;

  .enc-logo {
    height: 55px;
  }
  .cths-logo {
    width: 80px;
  }
}
</style>
