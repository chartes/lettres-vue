<template>
  <div class="wizard-center-form function-person-form">
    <b-field label="Description additionnelle">
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
      class="mt-5"
      @changed="selectionChanged"
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
      selected: null,

      selectedOptions: [],

      descriptionIsOk: true,
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
      this.setDescription(evt.item);
    },
    setDescription(desc) {
      desc = desc === "" ? null : desc;
      this.managePersonData({
        action: { name: "set-description" },
        data: desc,
      });
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
}
</style>
