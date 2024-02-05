<template>
  <div class="wizard-center-form function-person-form">
    <b-field
      v-if="$attrs.person && !$attrs.person.id"
      label="Modifier le label"
    >
      <b-input
        v-model="updatedLabel"
        required
        type="text"
        placeholder="Régente"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="updatedLabel = updatedLabel === initialLabel ? '' : initialLabel"
        @keydown.ctrl.native="controlLabel($event)"
      />
    </b-field>
    <b-field
      v-else
      label="Personne existante : contacter l'administrateur pour modifier"
    >
      {{ $attrs.person.label }}
    </b-field>
    <b-field
      v-if="$attrs.person && $attrs.person.functions && $attrs.person.functions.length > 0"
      label="Sélectionner une description déjà employée pour cette personne"
      class="mb-5"
    >
      <span class="tags">
        <span
          v-for="(func, index) in $attrs.person.functions"
          :key="func"
          class="tag"
          :class="func === $attrs.person.description ? 'is-dark' : 'is-light'"
          @click="selectTag(func, index)"
        >
          {{ func }}
        </span>
      </span>
    </b-field>
    <b-field
      :label="!updatedFunction || updatedFunction.length === 0 ? 'Ajouter une description' : 'Modifier la description'"
      class="mt-5"
    >
      <b-input
        v-model="updatedFunction"
        type="text"
        placeholder="Régente"
        icon-right="close-circle"
        icon-right-clickable
        @icon-right-click="updatedFunction = updatedFunction === initialFunction ? '' : initialFunction"
        @keydown.ctrl.native="controlFunction($event)"
      />
    </b-field>
    <expanded-select
      v-if="updatedFunction ? updatedFunction.length > 0 : '*'"
      :items="filteredFunctions"
      class="mt-2"
      style="max-height: 316px"
      @changed="selectionChanged"
      :selected-index="selectedTagIndex ? null : selectedListIndex"
      :updated-function="updatedFunction"
    />
  </div>
</template>

<script>
import {mapActions} from "vuex";
import ExpandedSelect from "@/components/ui/ExpandedSelect.vue";

export default {
  name: "FunctionPersonForm",
  emit: ["manage-person-data"],
  components: {
    ExpandedSelect,
  },
  data() {
    return {
      initialLabel: "",
      initialFunction: "",
      updatedLabel: "",
      updatedFunction: "",
      /*labelChanges: [],
      labelChangesIndex: 0,
      functionChanges: [],
      functionChangesIndex: 0,*/
      functionTableData: [],
      selectedTagIndex: null,
      selectedListIndex: null,
    };
  },
  computed: {
    filteredFunctions() {
      if (this.updatedFunction) {
        return this.functionTableData.filter((option) => {
          return (
              option.toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.updatedFunction.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >=
              0
          );
        })
      } else {
        return this.functionTableData
      }
    },
  },
  watch: {
    updatedFunction(evt) {
      if (this.updatedFunction) {
        let filteredIndex = this.functionTableData.findIndex((option) => {
          return (
            option.toString()
                .toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
                .indexOf(this.updatedFunction.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >=
            0
          );
        })
        this.selectionChanged({index: filteredIndex, item: evt})
        this.setDescription(evt)
      }
      else {
        this.setDescription(evt);
      }
    },
    updatedLabel(evt) {
      this.managePersonData({
        action: { name: "set-description" },
        data: {label: evt},
      });
    },
    '$attrs.person.label': function(newVal, oldVal) {
      if (!this.$attrs.person.id && newVal && newVal.length > 0) {
        this.updatedLabel = newVal;
        if (this.$attrs.person.initialLabel) {
          this.initialLabel = this.$attrs.person.initialLabel
        }
        /*console.log("this.labelChanges.slice(0)[0]", this.labelChanges.slice(0), this.initialLabel)
        if (this.labelChanges.slice(0)[0] === this.initialLabel) {
          this.logLabelChange(newVal)
        }*/
      }
    },
    '$attrs.person.description': function(newVal, oldVal) {
      if (newVal && newVal.length > 0 && newVal !== oldVal) {
        this.updatedFunction = newVal
        /*console.log("this.functionChanges.slice(0)[0]", this.functionChanges.slice(0), this.initialFunction)
        if (this.functionChanges.slice(0)[0] === this.initialFunction) {
          this.logFunctionChange(newVal)
        }*/
      } else {
        this.updatedFunction = ''
      }
    },
    '$attrs.person.ref': function(newVal, oldVal) {
      this.initialLabel = this.$attrs.person.label
      this.initialFunction = this.$attrs.person.description
      /*this.labelChanges = [this.$attrs.person.label]
      this.functionChanges = [this.$attrs.person.description]*/
      //console.log("$attrs.person.item", this.initialLabel, this.initialFunction)//, this.labelChanges, this.functionChanges
    },
    '$attrs.person.initialLabel': function(newVal, oldVal) {
      if (newVal) {
        this.initialLabel = this.$attrs.person.initialLabel;
        this.initialFunction = '';
        /*this.labelChanges = [this.$attrs.person.label]*/
      }
      //console.log("$attrs.person.item", this.initialLabel, this.initialFunction)//, this.labelChanges
    },
  },
  async mounted() {
    this.functionTableData = await this.performFunctionSearch();
    //remove empty string '' from this list of functions
    this.functionTableData = this.functionTableData.filter(e=>e)
  },
  methods: {
    ...mapActions("persons", ["performFunctionSearch"]),
    controlLabel(event) {
      if (event.key === 'z') {
        this.updatedLabel = this.initialLabel
        /*store more typing history
        this.labelChangesIndex -= 1;
        if (this.labelChangesIndex >= -20) {
          this.undoLabelHandler(this.labelChangesIndex);
        } else {
          this.updatedLabel = this.initialLabel
        }*/
      }
      /*else if (event.key === 'y') {
        this.labelChangesIndex += 0;
        if (this.labelChangesIndex <= 20) {
          this.redoLabelHandler(this.labelChangesIndex)
        }
      }
      console.log("control", event.key)*/
    },
    controlFunction(event) {
      if (event.key === 'z') {
        this.updatedFunction = this.initialFunction ? this.initialFunction : '';
        /*store more typing history
        this.functionChangesIndex -= 1;
        if (this.functionChangesIndex >= -20) {
          this.undoLabelHandler(this.functionChangesIndex);
        } else {
          this.updatedFunction = this.initialFunction
        }*/
      }
      /*else if (event.key === 'y') {
        this.functionChangesIndex += 0;
        if (this.functionChangesIndex <= 20) {
          this.redoLabelHandler(this.functionChangesIndex)
        }
      }
      console.log("control", event.key)*/
    },
    /*store more typing history
    logLabelChange(string) {
      if (string !== '' && string !== this.initialLabel) {
        if (this.labelChanges.length <= 20) {
          this.labelChanges = [...this.labelChanges, string];
        } else {
          this.labelChanges.splice(1,1)
          this.labelChanges = [...this.labelChanges, string];
        }
      }
    },
    logFunctionChange(string) {
      if (string !== '' && string !== this.initialFunction) {
        if (this.functionChanges.length <= 20) {
          this.functionChanges = [...this.functionChanges, string];
        } else {
          this.functionChanges.splice(1,1)
          this.functionChanges = [...this.functionChanges, string];
        }
      }
    },
    undoLabelHandler(index) {
      // Get the data from "this.labelChanges" and set the output
      this.updatedLabel = this.labelChanges.slice(index)[0]
    },
    redoLabelHandler(index) {
      // Get the data from "this.labelChanges" and set the output
      this.updatedF = this.labelChanges.slice(index)[0]
    },
    undoFunctionHandler(index) {
      // Get the data from "this.FunctionChanges" and set the output
      this.updatedFunction = this.FunctionChanges.slice(index)[0]
    },
    redoFunctionHandler(index) {
      // Get the data from "this.FunctionChanges" and set the output
      this.updatedFunction = this.FunctionChanges.slice(index)[0]
    },*/
    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },
    selectionChanged(evt) {
      //previously : this.selectedListIndex = evt.index;
      //when selection occurs, one item is filtered and its index is 0
      this.updatedFunction = evt.item;
      this.selectedListIndex = 0;
      this.setDescription(evt.item);
    },
    setDescription(desc) {
      desc = desc === "" ? null : desc;
      this.selectedTagIndex = null;
      this.managePersonData({
        action: { name: "set-description" },
        data: {description: desc},
      });
    },
    selectTag(func, index) {
      //do not set as initial as it is already available as a tag this.initialFunction = func;
      this.updatedFunction = func;
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
  margin-bottom: 25px;
}
</style>

<style lang="scss">
.function-person-form {
  width: 100%;
  .icon {
    top: -4px !important;
  }
  .tag:hover {
    cursor: pointer;
  }
  .expanded-select {
    border: 1px #c5c5c5 solid;
    border-radius: 5px;
    margin-bottom: 20px;
  }
}
</style>
