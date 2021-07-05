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
        v-model="searchedTerm"
        placeholder="e.g. BnF"
        open-on-focus
        :data="filteredDataObj"
        field="label"
        clearable
        @select="(option) => (selected = option)"
      >
        <template #header>
          <a @click="goToNewInstitutionForm">
            <span> Ajouter une institution... </span>
          </a>
        </template>
        <template v-if="searchedTerm" #empty>
          Aucun résultat pour {{ searchedTerm }}
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
    return {
      classificationMark: "",
      witnessTextContent: "",

      //institution
      searchedTerm: "",
      selected: null,
      institutionName: null,
      institutionRef: null,
    };
  },
  computed: {
    filteredDataObj() {
      return [{ label: "BnF" }, { label: "École" }].filter((option) => {
        return option.label.toLowerCase().indexOf(this.searchedTerm.toLowerCase()) >= 0;
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
