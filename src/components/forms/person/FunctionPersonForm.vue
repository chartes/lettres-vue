<template>
  <div class="wizard-center-form function-person-form">
    <b-field
      v-if="$attrs.person && !$attrs.person.id"
      label="Modifier le label"
      class="mt-5"
    >
      <b-input
        v-model="updatedLabel"
        required
        type="text"
        placeholder="Régente"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="updatedLabel = ''"
      />
    </b-field>
    <b-field
      v-else
      label="Personne existante : contacter l'administrateur pour modifier"
      class="mt-5"
    >
      {{ $attrs.person.label }}
    </b-field>

    <b-field
      label="Sélectionner une description déjà employée pour cette personne"
      class="mb-5"
      v-if="$attrs.person && $attrs.person.functions && $attrs.person.functions.length > 0"
    >
      <span class="tags">
        <span
          v-for="(func, index) in $attrs.person.functions"
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
        placeholder="Régente"
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
  name: "FunctionPersonForm",
  emit: ["manage-person-data"],
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
      this.updatedPerson = {...this.$attrs.person, "description": evt}
      this.setDescription(evt);
    },
    updatedLabel(evt) {
      this.updatedPerson = {...this.$attrs.person, "label": evt}
      this.managePersonData({
        action: { name: "set-person" },
        data: this.updatedPerson,
      });
    },
    '$attrs.person.label': function(newVal, oldVal) {
      if (!this.$attrs.person.id && newVal && newVal.length > 0) {
        this.updatedLabel = newVal
      }
    },
    '$attrs.person.description': function(newVal, oldVal) {
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
    ...mapActions("persons", ["performFunctionSearch"]),
    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },

    selectionChanged(evt) {
      this.selectedListIndex = evt.index;
      this.setDescription(evt.item);
    },
    setDescription(desc) {
      desc = desc === "" ? null : desc;
      this.selectedTagIndex = null;

      this.managePersonData({
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
  padding-right: 12px;
  margin-bottom: 60px;
}
</style>

<style lang="scss">
.function-person-form {
  .icon {
    top: -4px !important;
  }
  .tag:hover {
    cursor: pointer;
  }
}
</style>
