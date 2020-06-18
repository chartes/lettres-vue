<template>
  <div class="search-container">
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
          class="button pl-5 pr-5"
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
    ...mapActions('search', ['performSearch', 'setSearchTerm', 'setNumPage']),
    search() {
      if (!this.documentLoading) {
        this.setSearchTerm(this.inputTerm)
        this.setNumPage(1)
        //this.performSearch()
        if (this.$route.name !== 'search') {
          this.$router.push({'name': 'search'})
        } else {
          this.performSearch()
        }
      }
    }
  }
};
</script>

<style scoped>
.search-container input {
  width: 260px;
}
</style>
