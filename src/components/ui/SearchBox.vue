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
    <div class="control  has-icons-left">
      <input
        class="input"
        type="text"
        placeholder="Catherine de Medicis"
      >
      <span class="icon is-left">
        <i class="fas fa-search" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  components: {},
  props: {

  },
  data() {
    return {
      currentValue: null
    };
  },
  created() {}
};
</script>

<style scoped>
.search-container {
  width: 400px;
}
</style>
