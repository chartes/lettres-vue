<template>
  <div class="wizard-center-form function-place-form">
    <div class="columns">
      <div class="column">
        <b-field label="Description additionnelle">
          <b-input
            v-model="functionInputTerm"
            type="text"
            placeholder="Sous les remparts"
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="functionInputTerm = ''"
          />
        </b-field>
      </div>
      <div class="column">
        <expanded-select
          :items="filteredFunctions"
          class="mt-5"
          @changed="selectionChanged"
        />
      </div>
    </div>
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
  created() {
    /*
    this.managePlaceData({
      action: { name: "set-label" },
      data: { label: "this is the label" },
    });
    */
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
      this.functionInputTerm = "";
      this.setDescription(evt.item);
    },
    setDescription(desc) {
      desc = desc === "" ? null : desc;
      this.managePlaceData({
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

  width: 100%;
}
</style>

<style lang="scss">
.function-place-form {
  width: 100%;
  .icon {
    top: -4px !important;
  }
}
</style>
