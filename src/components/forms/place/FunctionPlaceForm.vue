<template>
  <div class="wizard-center-form function-place-form">
    <b-field
      v-if="$attrs.place && !$attrs.place.id"
      label="Modifier le label"
      class="mt-5"
    >
      <b-input
        v-model="updatedLabel"
        required
        type="text"
        placeholder="Sous les remparts"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="updatedLabel = ''"
      />
    </b-field>
    <b-field
      v-else
      label="Lieu existant : contacter l'administrateur pour modifier"
      class="mt-5"
    >
      {{ $attrs.place.label }}
    </b-field>

    <b-field
      label="Sélectionner une description déjà employée pour ce lieu"
      class="mb-5"
      v-if="$attrs.place && $attrs.place.functions && $attrs.place.functions.length > 0"
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

    <b-field
      :label="updatedFunction.length === 0 ? 'Ajouter une description' : 'Modifier la description'"
      class="mt-5"
    >
      <b-input
        v-model="updatedFunction"
        type="text"
        placeholder="Sous les remparts"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="updatedFunction = ''"
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
      updatedLabel: "",
      updatedFunction: "",
      functionTableData: [],
      selectedTagIndex: null,
      selectedListIndex: null,
    };
  },
  computed: {
    filteredFunctions() {
      return this.functionTableData.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(this.updatedFunction.toLowerCase()) >=
          0
        );
      });
    },
  },
  watch: {
    updatedFunction(evt) {
      this.updatedPlace = {...this.$attrs.place, "description": evt}
      this.setDescription(evt);
    },
    updatedLabel(evt) {
      this.updatedPlace = {...this.$attrs.place, "label": evt}
      this.managePlaceData({
        action: { name: "set-place" },
        data: this.updatedPlace,
      });
    },
    '$attrs.place.label': function(newVal, oldVal) {
      if (!this.$attrs.place.id && newVal && newVal.length > 0) {
        this.updatedLabel = newVal
      }
    },
    '$attrs.place.description': function(newVal, oldVal) {
      if (newVal && newVal.length > 0 && newVal !== oldVal) {
        this.updatedFunction = newVal
      } else {
        this.updatedFunction = ''
      }
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
      this.updatedFunction = '';
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
