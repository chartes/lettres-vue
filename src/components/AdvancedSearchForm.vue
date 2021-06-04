<template>
  <section class="">
    <span
      class="close-form"
      @click="hideAdvancedSearchForm"
    >
      <i
        class="far fa-times-circle"
      />
    </span>
    <div class="section grid-container">
      <search-box
        v-if="!showLeftSideBar"
        class="mt-5 mb-2"
      />

      Formulaire de recherche avancée
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SearchBox from "@/components/SearchBox";

export default {
    name: "AdvancedSearchForm",
    components: {
      SearchBox
    },
    computed: {
      ...mapState('layout', ['showLeftSideBar'])
    },
    created() {
     
    },
    methods: {
      ...mapActions('search', ['performSearch']),
      ...mapActions('layout', ['hideAdvancedSearchForm']),
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.close-form {
    font-size: 28px;
    
    position: relative;
    float: right;
    top: 10px;

    &:hover {
      cursor: pointer;
    }
}
</style>