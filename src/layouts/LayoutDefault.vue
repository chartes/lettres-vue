<template>
  <section class="main">
    <nav-bar />
    <section
      class="section"
      style="height: 100%"
    >
      <div
        v-if="$route.name === 'home'"
      >
        <div
          id="intro_home"
          class="bg-image content"
        >
          <div
            class="row"
          >
            <p class="homepage_title">
              Lettres
            </p>
          </div>
          <div class="row">
            <p class="homepage_subtitle">
              de la Première Modernité
            </p>
          </div>
          <div class="row is-flex is-justify-content-center mt-5">
            <b-button
              tag="router-link"
              to="/about"
              class="portail_button"
            >
              Le portail
            </b-button>
          </div>
        </div>
        <div class="row search_row">
          <div class="col is-2 ml-5 search_span">
            <span>Votre recherche</span>
          </div>
          <div class="column pt-3">
            <search-box
              class="m-5"
            />
          </div>
        </div>
      </div>
      <div
        v-else-if="$route.name === 'search'"
      >
        <div
          id="intro_search"
          class="bg-image content is-align-items-center"
        >
          <div class="row search_page_search_row">
            <div class="col is-2 ml-5 search_page_search_span">
              <span>Votre recherche</span>
            </div>
            <div class="column pt-3">
              <search-box
                class="m-5"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div
          v-if="showLeftSideBar && $route.name === 'search'"
          class="column is-3"
        >
          <div
            class="hide-left-bar"
            @click="hideLeftSideBar"
          >
            <i class="far fa-times-circle" />
          </div>
          <advanced-search-form v-if="$route.name === 'search'" />
        </div>
        <div class="column main-column">
          <div class="main-column-content">
            <slot />
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
          >
        </div>
      </nav>
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SearchBox from "@/components/SearchBox";
import background_image from "@/assets/images/about.jpg";
/*import SideBar from "@/components/SideBar.vue";*/
//import AdvancedSearchForm from ;

export default {
  name: "LayoutDefault",
  emit: ["refresh-viewer"],
  components: {
    NavBar,
    /*SideBar,*/
    SearchBox,
    AdvancedSearchForm: () => import("@/components/AdvancedSearchForm.vue"),
    MiradorViewer: () => import("@/components/MiradorViewer"),
  },
  data: function () {
    return {
      background_image: background_image,
      //featured_collectionIds : [73, 74, 75]
    }
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
      "hideLeftSideBar",
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
  background-color: white;
  padding-bottom: 0;
}
.main-column-content {
  padding: 18px;
  width: 100%;
  height: 100%;
  background-color: white;
}

.hide-left-bar {
  float: right;
  width: 32px;
  height: 32px;
  margin-top: 20px;
  cursor: pointer;
}

.hide-button {
  width: 15px;
  min-height: 100vh;
  /*background-color: $beige-lighter;*/
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
  .columns {
    margin: 0;
  }
}
footer {
  background-color: $nice-grey !important;
  padding: 15px 0 25px !important;
  z-index: 100;

  .enc-logo {
    height: 55px;
  }
  .cths-logo {
    width: 80px;
  }
}
#intro_home {
  background-image: url('../assets/images/about.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height:300px;
  width:auto;
  display:flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0 !important;
}
#intro_search {
  background-image: url('../assets/images/about.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height:150px;
  width:auto;
  display:flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0px !important;
}
#card_image {
  max-height: 250px;
}
.homepage_title {
  font-size: xxx-large;
  font-weight: bolder;
  text-shadow: 0px 2px, 2px 0px, 2px 2px;
  color: white;
  text-align: center;
}
.homepage_subtitle {
  font-size: x-large;
  color: white;
  text-align: center;
}
.metadata {
  font-size: xx-large;
  font-weight: bolder;
  text-shadow: 0px 2px, 2px 0px, 2px 2px;
  color: rgb(255, 0, 83);
  text-align: center;
}
.col_meta:not(:last-of-type) {
  border-right: solid 5px;
  border-right-color: rgba(180, 0, 80);
}
.card {
  overflow: hidden;
  border-radius: 0.5em;
}
.card-title {
  color: rgb(255, 0, 83);
}
.portail_button {
  background-color: transparent;
  color: white;
}
.search_row {
  background-color: rgba(35, 9, 20);
  padding: 5px;
  width: 100% !important;
  display:flex;
  flex-direction: row;
  align-items: center;
}
.search_page_search_row {
  background-color: transparent;
  padding: 5px;
  width: 100% !important;
  display:flex;
  flex-direction: row;
  align-items: center;
}
.search_span {
  background-color: rgba(35, 9, 20);
  color: white;
  text-align: center;
}
.search_page_search_span {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
  padding: 8px;
  border-radius: 3px;
}
/*a.button {
  border: none !important;
  outline: none !important;
}*/
.search_button {
  border-color: white !important;
  outline: none !important;
  box-shadow:none !important;
  color: rgba(35, 9, 20) !important;
 }
</style>
