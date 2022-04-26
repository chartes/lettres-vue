<template>
  <div class="wizard-center-form function-person-form">
    <b-field
      label="Sélectionner une description déjà employée pour cette personne"
      class="mb-5"
      v-if="$attrs.person && $attrs.person.functions"
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

    <b-field label="Ajouter une nouvelle description" class="mt-5">
      <b-input
        v-model="functionInputTerm"
        type="text"
        placeholder="Régente"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="functionInputTerm = ''"
      />
    </b-field>
    <expanded-select
      :items="filteredFunctions"
      class="mt-2"
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
  created() {},
  async mounted() {
    this.functionTableData = await this.performFunctionSearch();
  },
  methods: {
    ...mapActions("persons", ["performFunctionSearch"]),

    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },

    selectionChanged(evt) {
      this.functionInputTerm = "";
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
