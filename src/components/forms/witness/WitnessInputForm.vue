<template>
  <div class="wizard-center-form">
    <div class="editor">
      <rich-text-editor
        v-model="witnessTextContent"
        label="Témoin *"
        :formats="[
          ['italic', 'superscript'],
          ['note', 'link'],
        ]"
        :options="{ placeholder: 'Ex. Bibl. nat. Fr., Français 3512, fol. 53r' }"
        :multiline="false"
      />
    </div>
    <div class="editor">
      <rich-text-editor
        v-model="classificationMark"
        label="Cote / unité de conservation"
        :formats="[['italic', 'superscript'], ['link']]"
        :options="{ placeholder: 'Ex. Français 3512, Ms. 564, K 35' }"
        :multiline="false"
      />
    </div>

    <b-field label="Institution de conservation" class="institution-input">
      <b-autocomplete
        v-model="searchedInstitutionName"
        placeholder="e.g. BnF"
        open-on-focus
        :data="filteredDataObj"
        field="name"
        clearable
        @select="(option) => (selectedInstitution = option)"
      >
        <template #header>
          <a @click="goToNewInstitutionForm">
            <span> Ajouter une institution... </span>
          </a>
        </template>
        <template v-if="searchedInstitutionName" #empty>
          Aucun résultat pour {{ searchedInstitutionName }}
        </template>
      </b-autocomplete>
    </b-field>
  </div>
</template>

<script>
import RichTextEditor from "@/components/forms/fields/RichTextEditor";

export default {
  name: "WitnessInputForm",
  components: {
    RichTextEditor,
  },
  emits: ["goto-wizard-step", "manage-witness-data"],

  data() {
    const witness = this.$attrs.witness;
    return {
      witnessTextContent: witness && witness.content ? witness.content : "",
      classificationMark:
        witness && witness["classification-mark"] ? witness["classification-mark"] : "",

      //institution
      searchedInstitutionName: "",
      selectedInstitution: null,
    };
  },
  computed: {
    filteredDataObj() {
      return [
        { name: "BnF", ref: "http://bnf" },
        { name: "École", ref: "http://ecole" },
      ].filter((option) => {
        return (
          option &&
          option.name.toLowerCase().indexOf(this.searchedInstitutionName.toLowerCase()) >=
            0
        );
      });
    },
  },
  watch: {
    selectedInstitution(newVal, oldVal) {
      let data;
      if (newVal !== oldVal) {
        if (this.selectedInstitution) {
          data = {
            name: this.selectedInstitution.name,
            ref: this.selectedInstitution.ref,
          };
        } else {
          data = null;
        }

        this.$emit("manage-witness-data", {
          action: { name: "set-institution" },
          data,
        });
      }
    },
    "$attrs.witness.institution"() {
      const inst = this.$attrs.witness.institution;
      //this.fetchInstitutions();
      this.searchedInstitutionName = inst ? inst.name : "";
    },
    classificationMark() {
      this.$emit("manage-witness-data", {
        action: { name: "set-classification-mark" },
        data: this.classificationMark,
      });
    },
    witnessTextContent() {
      this.$emit("manage-witness-data", {
        action: { name: "set-witness-text-content" },
        data: this.witnessTextContent,
      });
    },
  },
  methods: {
    goToNewInstitutionForm() {
      this.$emit("goto-wizard-step", "institution-creation");
    },
    manageWitnessData(evt) {
      this.$emit("manage-witness-data", evt);
    },
    fetchInstitutions() {
      console.log("fetch institutions from api");
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  margin-bottom: 40px;
}
.wizard-center-form {
  padding-top: 75px;
  padding-left: 12px;
  width: 80%;
}
.institution-input {
  max-width: 420px;
}
</style>
