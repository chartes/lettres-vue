<template>
  <div v-show="totalPageNum > 1">
    <span
      class="icon button"
      :disabled="documentLoading"
      @click="performAction(1)"
    >
      <i class="fas fa-angle-double-left" />
    </span>
    <span
      class="icon button"
      :disabled="documentLoading"
      @click="performAction(parseInt(numPage)-1)"
    >
      <i class="fas fa-angle-left" />
    </span>
    <span class="pagination__button__input-box">
      <input
        v-model="currentInput"
        class="input"
        :disabled="documentLoading"
      >
      <span> / {{ totalPageNum }}</span>
    </span>
    <span
      class="icon button"
      :disabled="documentLoading"
      @click="performAction(parseInt(numPage)+1)"
    >
      <i class="fas fa-angle-right" />
    </span>
    <span
      class="icon button"
      :disabled="documentLoading"
      @click="performAction(totalPageNum)"
    >
      <i class="fas fa-angle-double-right" />
    </span>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Pagination",
  props: {},
  data() {
    return {
      currentInput: 1
    };
  },
  computed: {
    ...mapState("document", ["documents", "links", "documentLoading"]),
    ...mapState("search", ["numPage", "pageSize"]),
    ...mapGetters('search', ["totalPageNum"])
  },
  watch: {
    numPage: function() {
      this.currentInput = this.numPage;
    },
    currentInput:  function() {
      this.performAction(this.currentInput);
    }
  },
  created() {
    this.currentInput = this.numPage;
  },
  methods: {
    ...mapActions("search", ["performSearch", "setSearchTerm", "setNumPage"]),
    search() {
      if (!this.documentLoading) {
        this.performSearch();
      }
    },
    performAction(num){
      if (!parseInt(num)) {
        num = 1;
      }
      if (num > this.end) {
        num = this.end;
      } else if (num < this.start) {
        num = this.start;
      }
      this.setNumPage(num);
      this.search();
    }
  }
};
</script>

<style scoped lang="scss">

span.button {
  height: 16px;
  width: 40px;
  margin: 4px;
}
.pagination__button__input-box {
  margin-right: 16px;
  margin-left: 16px;
  line-height: 2.15;
  input {
    margin: 4px;
    width: 50px;
    height: 26px;
  }
}
</style>
