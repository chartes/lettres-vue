<template>
  <div class="root-container box modal-card">
    <div class="root-grid-container">
      <div class="leftbar-header-area">
        <h1 class="step-label is-uppercase is-size-2">
          {{ wizardLabel }}
        </h1>
        <h2 v-if="subtitle" class="step-label is-uppercase is-size-5 mb-3">
          {{ subtitle }}
        </h2>
        <h2 v-if="currentStep.label" class="step-label is-uppercase is-size-5">
          {{ currentStep.label }}
        </h2>
      </div>
      <div class="leftbar-content-area">
        <b-tabs v-model="activeTab" :animated="false">
          <b-tab-item
            v-for="(stepItem, i) in stepItems"
            :key="`left-step-${i}`"
            :label="stepItem.left ? stepItem.left.label : `left-step-${i}`"
          >
            <keep-alive v-if="stepItem.left">
              <component
                :is="stepItem.left.component"
                v-bind="stepItem.left.attributes"
                @goto-wizard-step="gotoStep"
                @manage-witness-data="manageWitnessData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="leftbar-footer-area" />

      <div class="center-content-area">
        <b-tabs v-model="activeTab">
          <b-tab-item
            v-for="(stepItem, i) in stepItems"
            :key="`center-step-${i}`"
            :label="stepItem.center ? stepItem.center.label : `center-step-${i}`"
          >
            <keep-alive v-if="stepItem.center">
              <component
                :is="stepItem.center.component"
                v-bind="stepItem.center.attributes"
                @goto-wizard-step="gotoStep"
                @manage-witness-data="manageWitnessData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="center-footer-area">
        <div class="buttons">
          <b-button type="is-primary" size="is-medium" @click="closeWizard">
            Annuler
          </b-button>

          <b-button
            v-if="currentStep.prev"
            type="is-primary"
            size="is-medium"
            class="previous-button"
            @click="gotoPrevStep"
          >
            Précédent
          </b-button>

          <b-button
            v-if="currentStep.next"
            type="is-primary"
            size="is-medium"
            @click="gotoNextStep"
          >
            <span>Suivant</span>
          </b-button>

          <span v-for="(stepItem, i) in stepItems" :key="`footer-buttons-step-${i}`">
            <span v-if="stepItem.footer && activeTab === i">
              <b-button
                v-for="(button, j) in stepItem.footer.buttons"
                :key="`button-${j}`"
                :type="button.type ? button.type : 'is-primary'"
                size="is-medium"
                @click="button.action()"
              >
                {{ button.label }}
              </b-button>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectOrCreatePlacenameForm from "@/components/forms/placename/SelectOrCreatePlacenameForm.vue";
import BestGuessPlacenameForm from "@/components/forms/placename/BestGuessPlacenameForm.vue";

export default {
  name: "PlacenameWizardForm",
  components: {
    SelectOrCreatePlacenameForm,
    BestGuessPlacenameForm,
  },
  props: {
    subtitle: { type: String, default: null },
    placenameInput: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeTab: 0,
      placename: {},
      collectedPages: [],
    };
  },
  computed: {
    wizardLabel() {
      return "Date de lieu";
    },
    currentStep() {
      return this.stepItems[this.activeTab > -1 ? this.activeTab : 0];
    },
    stepItems() {
      return [
        {
          name: "classification",
          left: {
            label: "left",
            component: "BestGuessPlacenameForm",
            attributes: { placename: this.placename },
          },
          center: {
            label: "center",
            component: "SelectOrCreatePlacenameForm",
            attributes: { placename: this.placename },
          },
        },
      ];
    },
  },
  async created() {
    if (this.$props.placenameInput) {
      const w = this.$props.placenameInput;
      this.placename = {
        status: [w.status],
        tradition: [w.tradition],
        institution: w.institution,
        "classification-mark": w["classification-mark"],
        content: w.content,
      };
    }
  },
  methods: {
    gotoStep(stepName) {
      const nextStepIndex = this.stepItems.findIndex((s) => s.name === stepName);
      if (nextStepIndex > -1) {
        this.activeTab = nextStepIndex;
      }
    },
    gotoNextStep() {
      const nextStep = this.stepItems[this.activeTab].next;
      if (nextStep) {
        this.gotoStep(nextStep);
      }
    },
    gotoPrevStep() {
      const prevStep = this.stepItems[this.activeTab].prev;
      if (prevStep) {
        this.gotoStep(prevStep);
      }
    },
    manageWitnessData({ action, data }) {
      console.log(`witness[${action.name}]`, data);
      switch (action.name) {
        case "set-status":
          this.placename.status = data.id;
          break;
        case "set-tradition":
          this.placename.tradition = data.id;
          break;
        case "set-institution":
          this.placename.institution = data;
          break;
        case "set-classification-mark":
          this.placename["classification-mark"] = data;
          break;
        case "set-witness-text-content":
          this.placename.content = data;
          break;
        default:
          break;
      }
    },
    closeWizard() {
      this.$parent.close();
    },
    async saveWitness() {
      if (this.placename.id) {
        //await this.$store.dispatch("document/updateWitness", this.placename);
      } else {
        //await this.$store.dispatch("document/addWitness", this.placename);
      }
      this.closeWizard();
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";

.root-container {
  overflow: hidden;

  min-height: 720px;
  min-width: 960px;

  width: 100%;
  height: inherit;

  padding: 0px !important;

  .label {
    color: inherit !important;
  }

  .step-label {
    font-family: $bitter-family;
    padding: 12px;
  }

  .wizard-center-form {
    margin-left: 12px;
    margin-right: 12px;
    min-width: 300px;
  }

  .previous-button {
    margin-left: 40px;
  }

  .leftbar-header-area,
  .leftbar-content-area,
  .leftbar-footer-area {
    background-color: $light !important;
  }

  .leftbar-header-area {
    grid-area: leftbar-header;
    h1 {
      padding-bottom: 0px;
    }
    h2 {
      padding-top: 0px;
      top: -12px;
      position: relative;
      left: 0px;
    }
  }
  .leftbar-content-area {
    grid-area: leftbar-content;

    .tabs {
      display: none !important;
    }
  }
  .leftbar-footer-area {
    grid-area: leftbar-footer;

    .buttons {
      margin-right: 20px;

      float: right;
      top: calc(50% - 26px);
      position: relative;
    }
  }

  .center-content-area {
    grid-area: center-content;
    height: 100%;

    .tabs {
      display: none !important;
    }
    .b-tabs {
      height: 100%;
      .tab-content {
        padding: 0;
      }
      .tab-content,
      .tab-item {
        height: 100%;
      }
    }
  }
  .center-footer-area {
    grid-area: center-footer;
    justify-self: end;
    align-self: center;
    .buttons {
      margin-right: 20px;
    }
  }

  .root-grid-container {
    display: grid;
    min-height: inherit;
    height: 100%;

    grid-template-columns: minmax(280px, 28%) minmax(800px, auto);
    grid-template-rows: 120px auto 80px;
    grid-template-areas:
      "leftbar-header center-content"
      "leftbar-content center-content"
      "leftbar-footer center-footer";
  }
}
</style>
