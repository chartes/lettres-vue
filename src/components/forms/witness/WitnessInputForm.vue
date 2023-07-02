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
        @add-note="addNote"
      />
    </div>
    <div class="editor">
      <rich-text-editor
        v-model="classificationMark"
        label="Unité de conservation"
        :formats="[['italic', 'superscript'], ['link']]"
        :options="{ placeholder: 'Ex. Français 3512, Ms. 564, K 35' }"
        :multiline="false"
      />
    </div>

    <b-field
      label="Institution de conservation"
      class="institution-input"
    >
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
        <template
          v-if="searchedInstitutionName"
          #empty
        >
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
  emits: ["goto-wizard-step", "manage-witness-data", "add-note"],
  data() {
    const witness = this.$attrs.witness;
    return {
      witnessTextContent: witness && witness.content ? witness.content : "",
      classificationMark:
        witness && witness["classification-mark"] ? witness["classification-mark"] : "",

      //institution
      searchedInstitutionName:
        witness && witness.institution ? witness.institution.name : "",
      selectedInstitution: witness && witness.institution ? witness.institution : null,
    };
  },
  computed: {
    filteredDataObj() {
      return [
        { name: "Paris, Bibl. nat. Fr.", ref: "http://bnf" },
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
    addNote(event) {
      console.log('witness input')
      this.$emit('add-note', event)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.editor {
  margin-bottom: 40px;
}
.wizard-center-form {
  padding-top: 75px;
  padding-left: 12px;
  width: 80%;

  @include on-tablet {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
.institution-input {
  max-width: 420px;
}
</style>
