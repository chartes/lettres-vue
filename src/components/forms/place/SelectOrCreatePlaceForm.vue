<template>
  <div class="place-wizard-center-form">
    <b-tabs v-model="activeTab">
      <b-tab-item id="search" label="Référentiel de l'application">
        <place-list
          v-bind="$attrs"
          :popup-mode="popupMode"
          @manage-place-data="managePlaceData"
        />
      </b-tab-item>

      <b-tab-item id="add" label="Nouveau lieu">
        <create-place-form
          v-bind="$attrs"
          :popup-mode="popupMode"
          @manage-place-data="managePlaceData"
        />
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
  props: {
    popupMode: { type: Boolean, default: true },
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

<style lang="scss">
.place-wizard-center-form {
  padding-top: 25px;
  padding-left: 12px;
  padding-right: 20px;
  margin-bottom: 60px;

  .label {
    color: inherit !important;
  }
  .search-input {
    max-width: 420px;
    min-width: 400px;
  }

  nav.tabs {
    display: initial !important;
  }
}
</style>
