<template>
  <div>SelectOrCreatePlacenameForm</div>
</template>

<script>
export default {
  name: "SelectOrCreatePlacenameForm",
  emit: ["manage-placename-data"],
  data() {
    return {};
  },
  watch: {},
  created() {
    this.managePlacenameData({
      action: { name: "set-label" },
      data: { label: "this is the label" },
    });
  },
  methods: {
    managePlacenameData(evt) {
      this.$emit("manage-placename-data", evt);
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: inherit !important;
}
</style>
