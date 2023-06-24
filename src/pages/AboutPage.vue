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
        <div class="container fluid tab-tabs-parent"
             :class="isMenuOpened?'opened':''"
        >
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
  width: 240px !important;

  @include on-small-tablet {
    ul {
      margin-left: 0;
    }
  }

  @include on-mobile {
    height: 100%;
    left: 0;
    top: 0;
    padding-top: 110px;
    transition: .3s cubic-bezier(.25,.8,.5,1);
    transform: translateX(-110%);
    border-right: 1px solid #ccc;
    background-color: #fff;
    z-index: 1;
  }
}

.tab-tabs-parent.opened {
  ::v-deep nav.tabs {
    transform: translateX(0);
  }
}

.head--section {
  position: relative;
}

.toggle-menu-btn {
  display: none !important;

  @include on-mobile {
    display: flex !important;
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:before {
      background-color: currentColor;
      border-radius: inherit;
      bottom: 0;
      color: inherit;
      content: "";
      left: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      transition: opacity .2s cubic-bezier(.4,0,.6,1);
    }

    &:hover {
      &:before {
        opacity: .08;
      }
    }
  }
}

::v-deep section.tab-content {
  margin-left: 25vw !important;
  padding: 25px 0 25px 40px;

  @include on-mobile {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
}
::v-deep li a {
  justify-content: right !important;
  background: transparent !important;
  border: none !important;
  border-left: solid 2px transparent !important;
  border-radius: 0;
  min-height: 48px;
  font-size: .875rem;
  font-weight: 600;
  text-align: right;
  text-transform: uppercase;
}
::v-deep li.is-active a {
  // background-color: rgb(127, 0, 56) !important;
  // border-color: rgb(127, 0, 56) !important;
  border-radius: 0 !important;
  border-left: solid 2px rgb(127, 0, 56) !important;
  color: rgb(127, 0, 56) !important;
}
::v-deep h2.subtitle {
  color: #C00055 !important;
}
</style>