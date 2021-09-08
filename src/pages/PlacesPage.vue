<template>
  <div>
    <b-tabs v-model="activeTab" :multiline="multiline">
      <template v-for="tab in tabs">
        <b-tab-item v-if="tab.displayed" :key="tab.id" :value="tab.id" :label="tab.label">
          <keep-alive>
            <component :is="tab.component" />
          </keep-alive>
        </b-tab-item>
      </template>
    </b-tabs>
  </div>
</template>

<script>
import PlaceList from "@/components/sections/PlaceList.vue";
import CreatePlaceForm from "@/components/forms/placename/CreatePlaceForm.vue";

export default {
  name: "PlacePages",
  components: {
    PlaceList,
    CreatePlaceForm,
  },
  data() {
    return {
      activeTab: "search",
      multiline: true,
    };
  },
  computed: {
    tabs() {
      return [
        {
          id: "search",
          label: "Référentiel de l'application",
          component: "PlaceList",
          displayed: true,
        },
        {
          id: "add",
          label: "Ajout d'un lieu",
          component: "CreatePlaceForm",
          displayed: true,
        },
      ];
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
