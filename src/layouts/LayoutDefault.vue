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
          <div
            class="row"
          >
            <p class="homepage_subtitle">
              de la Première Modernité
            </p>
          </div>
          <div
            class="row is-flex is-justify-content-center"
          >
            <b-button
              tag="router-link"
              to="/about"
              class="portail_button"
            >
              À propos du portail
            </b-button>
          </div>
        </div>
        <div class="row search_row is-align-items-center">
          <div class="col is-2">
            <span class="search_span">Votre recherche</span>
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
      <nav>
        <ul class="is-flex is-justify-content-space-between">
          <li>
            <a href="">
              <img
                  class="enc-logo"
                  src="@/assets/images/logos/logo-footer.png"
              >
            </a>
          </li>
          <li>
            <a href="">
              <img
                  class="cths-logo"
                  src="@/assets/images/logos/logo-cths-footer.png"
              >
            </a>
          </li>
        </ul>
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
}
.column {
  margin-top: 0;
  padding: 0;
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
  width: $container-max-width;
  margin: 18px auto;
  background-color: white;

  @include on-small-desktop {
    width: calc( 100vw - 2 * $container-small-desktop-margin );
    margin: 18px $container-small-desktop-margin;
  }

  @include on-tablet {
    width: calc( 100vw - 2 * $container-tablet-margin );
    margin: 18px $container-tablet-margin;
  }

  @include on-mobile {
    width: calc( 100vw - 2 * $container-mobile-margin );
    margin: 18px $container-mobile-margin;
  }
}
.main-column-content section .container {
  margin: 0 !important;
}

::v-deep .narrow-container {
  margin-left: $container-narrow-margin;
  margin-right: $container-narrow-margin;

  @include on-small-desktop {
    margin-left: 10%;
    margin-right: 10%;
  }

  @include on-tablet {
    margin-left: 5%;
    margin-right: 5%;
  }

  @include on-mobile {
    margin-left: 0;
    margin-right: 0;
  }
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
  background-color: $footer-background-color !important;
  border-top: solid 6px #7F0038;
  padding: 90px 0 !important;
  z-index: 100;

  nav {
    width: $container-max-width;
    margin: 0 auto;

    .enc-logo {
      height: 70px;
    }

    .cths-logo {
      height: 100px;
    }
  }
}
#intro_home {
  position: relative;
  background-image: url('../assets/images/about.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height:443px;
  width:auto;
  display:flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0 !important;

  @include on-tablet {
    height:320px;
  }
}
#intro_home::before {
  content: "";
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  background-color: #00000066;
  z-index: 1;
}
#intro_home::after {
  content: "";
  position: absolute;
  left: 0;
  top:0;
  display: block;
  width: 100%;
  height: 70px;
  background-image: linear-gradient(#000000 0% ,#D8D8D800 100%);
  opacity: 0.50;
  z-index: 2;
}
#intro_home > * {
  position: relative;
  z-index: 2;
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
  margin-top: 20px;
  font-family: $family-apptitle;
  font-weight: 200;
  font-size: 210px;
  line-height: 1;
  color: white;
  text-align: center;

  @include on-tablet {
    font-size: 100px;
  }
}
.homepage_subtitle {
  font-family: $family-apptitle;
  font-weight: 200;
  font-size: 58px;
  line-height: 1;
  color: white;
  text-align: center;
  transform: translateY(-18px);

  @include on-tablet {
    font-size: 30px;
    transform: none;
  }
}
.metadata {
  font-size: xx-large;
  font-weight: bolder;
  text-shadow: 0px 2px, 2px 0px, 2px 2px;
  color: rgb(255, 0, 83);
  text-align: center;
}
.card {
  overflow: hidden;
  background-color: #F0F0F0;
  border-radius: 10px;
  box-shadow: none;
}
.card-title {
  color: rgb(255, 0, 83);
}
a.portail_button {
  margin-top: 26px;
  padding: 0 1em;
  background-color: transparent;
  border-color: #FFFFFF;
  border-width: 1px;
  border-radius: 5px;
  font-family: $family-secondary;
  font-size: 18px;
  text-align: center;
  font-weight: 400;
  color: #FFFFFF;
  text-transform: uppercase;
}
a.portail_button:hover {
  color: #FFFFFF;
}
.search_row {
  background-color: #230914;
  padding: 1px calc( 0.5 * (100% - $nav-max-width) );
  width: 100% !important;
  display:flex;
  flex-direction: row;
  align-items: center;

  & > .column.pt-3 {
    padding-top: 0 !important;
  }

  @include on-small-desktop {
    padding-left: $container-small-desktop-margin;
    padding-right: $container-small-desktop-margin;
  }
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
  margin-left: 0 !important;
  background-color: rgba(35, 9, 20);
  font-family: $family-primary;
  font-size: 20px;
  color: white;
  text-align: center;
}
.search-container.m-5 {
  margin-left: 25px !important;
  margin-right: 0 !important;
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
