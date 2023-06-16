<template>
  <section>
    <div class="">
      <div class="content head--section">
        <div class="head--section">
          <div class="is-inline-block"><h3>Le portail</h3></div>
          <div
            class="toggle-menu-btn is-inline-block"
            @click="toggleMenu($event)"
          >
            <i class='fas fa-bars'/>
          </div>
        </div>
        <div class="container fluid tab-tabs-parent">
          <b-tabs
            type="is-toggle"
            size="is-medium"
            vertical
            @click.native="scrollToTop"
          >
            <b-tab-item
              key="contents"
              label="La correspondance"
              icon=""
            >
              <contents-section />
            </b-tab-item>
            <b-tab-item
              key="project"
              label="Le projet"
              icon=""
            >
              <project-section />
            </b-tab-item>
            <b-tab-item
              key="members"
              label="Membres"
              icon=""
            >
              <members-section />
            </b-tab-item>
            <b-tab-item
              key="collections"
              label="Les collections"
              icon=""
            >
              <collections-section />
            </b-tab-item>
            <b-tab-item
              key="editions"
              label="Les éditions"
              icon=""
            >
              <editions-section />
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ContentsSection from '../pages/about/ContentsSection'
import ProjectSection from '../pages/about/ProjectSection'
import MembersSection from '../pages/about/MembersSection'
import CollectionsSection from '../pages/about/CollectionsSection'
import EditionsSection from '../pages/about/EditionsSection'

export default {
  name: "AboutPage",
  components: { ContentsSection, ProjectSection, MembersSection, CollectionsSection, EditionsSection },
  data () {
    return {
      isMenuOpened: false
    }
  },
  methods: {
    scrollToTop () {
      window.scrollTo(0, 0)
    },
    toggleMenu ($event) {
      $event.preventDefault()
      $event.stopImmediatePropagation()
      this.isMenuOpened = !this.isMenuOpened
    },
    closeMenu () {
      this.isMenuOpened = false
    }
  },
  computed: {
    menuCsscClass () {
      return this.isMenuOpened ? 'true' : ''
    }
  },
  mounted () {
    document.body.addEventListener('click', this.closeMenu)
  },
  beforeDestroy () {
    document.body.removeEventListener('click', this.closeMenu)
  }
}

</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.content h3 {
  font-family: $family-primary;
  font-size: 28px;
  color: #000000;
  margin-bottom: 40px;

  @include on-tablet {
    font-size: $font-size-title-tablet;
    margin-bottom: 20px;
  }

  @include on-mobile {
    font-size: $font-size-title-mobile;
    margin-bottom: 20px;
  }
}
::v-deep nav.tabs {
  position: fixed;
  max-width: 20vw !important;
  min-width: min-content;
}
::v-deep section.tab-content {
  margin-left: 25vw !important;
  padding: 25px;
}
::v-deep li.is-active a {
  background-color: rgb(127, 0, 56) !important;
  border-color: rgb(127, 0, 56) !important;
}
::v-deep h2.subtitle {
  color: #C00055 !important;
}
</style>