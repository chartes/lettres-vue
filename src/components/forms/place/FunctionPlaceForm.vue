<template>
  <div class="wizard-center-form function-place-form">
    <b-field
      label="Sélectionner une description déjà employée pour ce lieu"
      class="mb-5"
      v-if="$attrs.place && $attrs.place.functions"
    >
      <span class="tags">
        <span
          v-for="(func, index) in $attrs.place.functions"
          :key="func"
          class="tag is-light"
          :class="index === selectedTagIndex ? 'is-dark' : ''"
          @click="selectTag(func, index)"
        >
          {{ func }}
        </span>
      </span>
    </b-field>

    <b-field label="Ajouter une nouvelle description" class="mt-5">
      <b-input
        v-model="functionInputTerm"
        type="text"
        placeholder="Sous les remparts"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="functionInputTerm = ''"
      />
    </b-field>

    <expanded-select
      :items="filteredFunctions"
      class="mt-2"
      style="max-height: 320px"
      @changed="selectionChanged"
      :selected-index="selectedTagIndex ? null : selectedListIndex"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ExpandedSelect from "@/components/ui/ExpandedSelect.vue";

export default {
  name: "FunctionPlaceForm",
  emit: ["manage-place-data"],
  components: {
    ExpandedSelect,
  },
  data() {
    return {
      functionInputTerm: "",
      functionTableData: [],
      selectedTagIndex: null,
      selectedListIndex: null,
    };
  },
  computed: {
    filteredFunctions() {
      return this.functionTableData.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(this.functionInputTerm.toLowerCase()) >=
          0
        );
      });
    },
  },
  watch: {
    functionInputTerm() {
      this.setDescription(this.functionInputTerm);
    },
  },
  async mounted() {
    this.functionTableData = await this.performFunctionSearch();
  },
  methods: {
    ...mapActions("placenames", ["performFunctionSearch"]),

    managePlaceData(evt) {
      this.$emit("manage-place-data", evt);
    },

    selectionChanged(evt) {
      this.selectedListIndex = evt.index;
      this.setDescription(evt.item);
    },
    setDescription(desc) {
      desc = desc === "" ? null : desc;
      this.selectedTagIndex = null;
      this.managePlaceData({
        action: { name: "set-description" },
        data: desc,
      });
    },
    selectTag(func, index) {
      this.functionInputTerm = "";
      this.selectedListIndex = null;

      this.setDescription(func);
      this.selectedTagIndex = index;
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
  padding-right: 32px;
  margin-bottom: 60px;

  width: 100%;
}
</style>

<style lang="scss">
.function-place-form {
  width: 100%;
  .icon {
    top: -4px !important;
  }
  .tag:hover {
    cursor: pointer;
  }
}
</style>
