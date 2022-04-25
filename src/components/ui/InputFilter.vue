<template>
  <span>
    <button
      class="button is-white"
      @click="toggle"
    >
      {{ label }}<i class="fas fa-filter" />
    </button>
    <input
      v-if="isActive"
      v-model="filterValue"
      class="input is-small"
      :placeholder="placeHolder"
      @change="action(filterValue)"
    >
  </span>
</template>

<script>
export default {
  name: "InputFilter",
  props: {
    label: { required: true, type: String },
    placeHolder: { default: "", type: String },
    action: { required: true, type: Function },
  },
  data() {
    return {
      filterValue: null,
      isActive: false,
    };
  },
  computed: {},
  methods: {
    toggle() {
      this.isActive = !this.isActive;
      if (!this.isActive) {
        this.filterValue = null;
        this.action(this.filterValue);
      }
    },
  },
};
</script>

<style scoped>
.fa-filter {
  color: darkslategrey;
  height: 14px;
  margin-left: 12px;
}
</style>
