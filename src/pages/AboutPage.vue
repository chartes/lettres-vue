<template>
  <section>
    <div class="container m-5">
      <div class="container">
        <p class="title">
          Le portail
        </p>
        <b-tabs
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
  components: {ContentsSection, ProjectSection, MembersSection, CollectionsSection, EditionsSection
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>