<template>
  <div class="wizard-center-form">
    <b-tabs v-model="activeTab">
      <b-tab-item id="search" label="Référentiel de l'application">
        <place-list v-bind="$attrs" @manage-place-data="managePlaceData" />
      </b-tab-item>

      <b-tab-item id="add" label="Nouveau lieu">
        <create-place-form v-bind="$attrs" @manage-place-data="managePlaceData" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import PlaceList from "@/components/sections/PlaceList.vue";
import CreatePlaceForm from "@/components/forms/place/CreatePlaceForm.vue";

export default {
  name: "SelectOrCreatePlaceForm",
  components: {
    PlaceList,
    CreatePlaceForm,
  },
  emit: ["manage-place-data"],
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {},
  watch: {
    activeTab() {},
  },
  async mounted() {},
  methods: {
    managePlaceData(evt) {
      this.$emit("manage-place-data", evt);
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: inherit !important;
}
.wizard-center-form {
  padding-top: 25px;
  padding-left: 12px;
  padding-right: 20px;
  margin-bottom: 60px;
}
.search-input {
  max-width: 420px;
  min-width: 400px;
}
</style>
