<template>
  <div class="search-container">
    <b-field>
      <b-input
        v-model="inputTerm"
        class="search_input"
        placeholder="Catherine de Medicis"
        icon-right="close-circle"
        icon-right-clickable
        type="search"
        @icon-right-click="inputTerm = ''"
        @focus="$event.target.select()"
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
import { mapState, mapActions } from "vuex";

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
  vertical-align: center;
}
.control, .search_input {
  width: 100% !important;
}
/* align close button ?
span.icon {

}*/
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
