<template>
  <section class="main">
    <nav-bar />
    <section
      class="section"
      style="height: 100%"
    >
      <div class="columns">
        <div
          v-show="showLeftSideBar"
          class="column is-2 "
        >
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
              class=" hide-button  is-vertical divider-left"
              @click="toggleLeftSideBar"
            />
            <div class=" main-column-content">
              <slot />
            </div>
            <div
              v-show="iiifManifestUrl"
              class=" hide-button  is-vertical divider-right"
              @click="toggleRightSideBar"
            />
          </div>
        </div>
        <div
          v-show="rightSideBarIsVisible"
          class="column is-5"
          style="background-color: #F6F6F6"
        >
          <mirador-viewer
            v-if="iiifManifestUrl"
            class="mirador-container"
            :manifest-url="iiifManifestUrl"
          />
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Projet LETTRES</strong> by
          ENC
        </p>
      </div>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
//import MiradorViewer from "@/components/MiradorViewer";

export default {
  name: "LayoutDefault",
  components: {
    NavBar,
    SideBar,
    MiradorViewer: () =>
      import(
        /* webpackChunkName: "mirador" */ "@/components/MiradorViewer"
      )
  },

  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showLeftSideBar", "showRightSideBar"]),
    ...mapState("document", ["document"]),

    iiifManifestUrl() {
      let url;
      if (this.$route.name === "document" && this.document) {
        url = this.document["iiif-collection-url"];
      } else {
        //url = 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b550076223/manifest.json';
      }

      return url;
    },

    rightSideBarIsVisible() {
     return this.showRightSideBar && ['document'].indexOf(this.$route.name) > -1 
    }
  },
  watch: {
    iiifManifestUrl() {
      if (!this.iiifManifestUrl) {
        //this.hideRightSideBar();
      }
    }
  },
  created() {
   
  },
  methods: {
    ...mapActions("layout", [
      "toggleLeftSideBar",
      "toggleRightSideBar",
      "hideRightSideBar"
    ])
  }
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
  }
}
.main {
  background-color: $white-ter;
  min-height: 100%;
}
.main-column {
  background-color: $white;
  padding-bottom: 0;
}
.main-column-content {
  padding: 30px;
  width: 100%;
}
.hide-button {
  width: 15px;
  min-height: 100vh;
  background-color: $white-ter;
  border: 1px solid;
  border-top: none;
  border-bottom: none;
  &:hover {
    background-color: lightgrey;
    cursor: pointer;
  }
  &.divider-left {
    padding-left: 25px;
    border-right-color:  $nice-grey;
    border-left: none;
  }
  &.divider-right {
    padding-right: 25px;
    border-left-color:  $nice-grey;
    border-right: none;
  }
}

.section {
  padding: 0;
}
footer {
  background-color: $nice-grey  !important;
  margin-top: 12px;
  padding: 25px 0px 50px !important;
}
</style>
