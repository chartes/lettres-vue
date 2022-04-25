<template>
  <div class="person-wizard-center-form">
    <b-tabs v-model="activeTab">
      <b-tab-item
        id="search"
        label="Référentiel de l'application"
      >
        <person-list
          v-bind="$attrs"
          :popup-mode="popupMode"
          @manage-person-data="managePersonData"
        />
      </b-tab-item>

      <b-tab-item
        v-if="popupMode"
        id="add"
        label="Nouvelle personne"
      >
        <create-person-form
          v-bind="$attrs"
          :popup-mode="popupMode"
          @manage-person-data="managePersonData"
        />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import PersonList from "@/components/sections/PersonList.vue";
import CreatePersonForm from "@/components/forms/person/CreatePersonForm.vue";

export default {
  name: "SelectOrCreatePersonForm",
  components: {
    PersonList,
    CreatePersonForm,
  },
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-person-data"],
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
    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },
  },
};
</script>

<style lang="scss">
.person-wizard-center-form {
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
