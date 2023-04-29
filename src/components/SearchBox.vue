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
        :lazy="true"
        @icon-right-click="inputTerm = ''"
        @focus="$event.target.select()"
        @keyup.native.enter="search"
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
      this.performSearch();
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

  ::v-deep input[type="search"] {
    border-color: #FFFFFF !important;
    height: 100%;
    padding-top: 2px;
    padding-bottom: 2px;

    font-family: $family-primary;
    font-size: 18px;
    font-weight: 400;
    color: #343434;

    @include on-mobile {
      font-size: 15px;
    }

    &:hover,
    &:focus {
      border-color: transparent !important;
      box-shadow: none !important;
    }
  }
}

/* align close button ?
span.icon {

}*/

.advanced-search {
  width: 100%;
  text-align: right;
}

.search_button {
  border-color: white !important;
  outline: none !important;
  box-shadow: none !important;
  color: rgba(127, 0, 56) !important;
  border-bottom-left-radius: 0px !important;
  border-top-left-radius: 0px !important;

  &.pl-5 {
    @include on-mobile {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }

  i.fa-search {
    text-indent: -9999px;
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url(../assets/images/icons/loupe_header.svg) center / contain no-repeat;

    @include on-mobile {
      width: 20px;
      height: 20px;
    }
  }

 }

</style>
