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
              (showRightSideBar ? 'padding-right: 0;' : '')
          "
        >
          <div class="tile">
            <div
              class="tile hide-button"
              @click="toggleLeftSideBar"
            />

            <div class="tile main-column-content">
              <slot />
            </div>
            <div
              v-show="iiifManifestUrl"
              class="tile hide-button"
              @click="toggleRightSideBar"
            />
          </div>
        </div>
        <div
          v-show="showRightSideBar"
          class="column is-6"
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
          <strong>Bulma</strong> by
          <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is
          licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The
          website content is licensed
          <a
            href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
          >CC BY NC SA 4.0</a>.
        </p>
      </div>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import MiradorViewer from "@/components/MiradorViewer";

export default {
  name: "LayoutDefault",
  components: { NavBar, SideBar, MiradorViewer },

  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showLeftSideBar", "showRightSideBar"]),
    ...mapState("document", ["document"]),

    iiifManifestUrl() {
      let url;
      if (this.$route.name === "document" && this.document) {
        url = this.document['iiif-collection-url'];
      } else {
        //url = 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b550076223/manifest.json';
      }

      return url;
    }
  },
  watch: {
    iiifManifestUrl() {
      if (!this.iiifManifestUrl) {
        this.hideRightSideBar()
      }
    }
  },
  created() {
    //this.$store.dispatch('user/fetchCurrent');
  },
  methods: {
    ...mapActions("layout", ["toggleLeftSideBar", "toggleRightSideBar", "hideRightSideBar"])
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
  &.is-2, &.is-6 {
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
}
.hide-button {
  max-width: 25px;
  min-height: 100vh;
  background-color: $white-ter;
  &:hover {
    background-color: lightgrey;
    cursor: pointer;
  }
}
.section {
  padding: 0;
}
.footer {
  background-color: lightgrey;
  margin-top: 12px;
}
</style>
