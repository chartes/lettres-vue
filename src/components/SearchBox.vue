<template>
  <div class="search-container">
    <b-field>
      <b-input
        class="search_input"
        v-model="inputTerm"
        placeholder="Catherine de Medicis"
        type="search"
      />
      <div>
        <a
          class="button pl-5 pr-5 search_button"
          @click="search"
        >
          <span class="icon">
            <i
              v-if="loadingStatus"
              class="fas fa-spinner fa-pulse"
            />
            <i
              v-else
              class="fas fa-search"
            />
          </span>
        </a>
      </div>
    </b-field>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "SearchBox",
  components: {},
  props: {},
  data() {
    return {
      inputTerm: null,
    };
  },
  computed: {
    ...mapState("search", ["searchTerm", "loadingStatus"]),
  },
  watch: {
    inputTerm() {
      this.setSearchTerm(this.inputTerm);
    }
  },
  created() {
    this.inputTerm = this.searchTerm;
  },
  methods: {
    ...mapActions("search", ["performSearch", "setSearchTerm", "setNumPage"]),
    search() {
      if (!this.documentLoading) {
        this.setSearchTerm(this.inputTerm);
        this.setNumPage(1);
        //this.performSearch()
        this.performSearch();

        if (this.$route.name !== "search") {
          this.$router.push({ name: "search" });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.search-container input {
  width: 100% !important;
}
.control{
  width: 100% !important;
}
.advanced-search {
  width: 100%;
  text-align: right;
}
.search_row .search_button {
  border-color: white !important;
  outline: none !important;
  box-shadow: none !important;
  color: rgba(127, 0, 56) !important;
  border-bottom-left-radius: 0px !important;
  border-top-left-radius: 0px !important;
 }

</style>
