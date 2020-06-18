<template>
  <div class="search-container">
    <!--
    <v-text-field
      v-model="currentValue"
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="search"
      label="Search"
      class="hidden-sm-and-down"
      type="text"
      placeholder="Catherine de Medicis"
      @keyup.enter="action(currentValue)"
    />
    -->
    <div class="field has-addons">
      <div class="control">
        <input
          v-model="inputTerm"
          class="input"
          type="text"
          placeholder="Catherine de Medicis"
          @keyup.enter="search"
        >
      </div>
      <div class="control">
        <a
          class="button is-info"
          @click="search"
        >
          <span class="icon">
            <i
              v-if="documentLoading"
              class="fas fa-spinner fa-pulse"
            />
            <i
              v-else
              class="fas fa-search"
            />
          </span>
        </a>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "SearchBox",
  components: {},
  props: {

  },
  data() {
    return {
      currentValue: null,
      inputTerm: null
    };
  },
  computed: {
    ...mapState('search', ['searchTerm']),
    ...mapState('document', ['documentLoading'])
  },
  watch: {
    inputTerm() {
      this.setSearchTerm(this.inputTerm)
    }
  },
  created() {
    this.inputTerm = this.searchTerm
  },
  methods: {
    ...mapActions('search', ['performSearch', 'setSearchTerm']),
    search() {
      if (!this.documentLoading) {
        this.setSearchTerm(this.inputTerm)
        this.performSearch()
      }
    }
  }
};
</script>

<style scoped>
.search-container {
  width: 400px;
}
</style>
