<template>
  <div class="root-container box">
    <div class="root-grid-container">
      <div class="leftbar-header-area">
        <h1 class="step-label is-uppercase is-size-2">
          {{ wizardLabel }}
        </h1>
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
                @set-source-manifest="setSourceManifest"
                @manage-manifest-data="manageManifestData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="center-footer-area" />
      <div class="center-footer-buttons-area">
        <div class="buttons">
          <b-button type="is-primary" size="is-medium"> Annuler </b-button>

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
import WitnessInputForm from "@/components/forms/witness/WitnessInputForm.vue";
import WitnessStatusTraditionForm from "@/components/forms/witness/WitnessStatusTraditionForm.vue";
import InstitutionCreationForm from "@/components/forms/institution/InstitutionCreationForm";
import ImageSourceForm from "@/components/forms/manifest/ImageSourceForm";
import ManifestCreationForm from "@/components/forms/manifest/ManifestCreationForm";

export default {
  name: "WizardForm",
  components: {
    WitnessInputForm,
    WitnessStatusTraditionForm,
    ImageSourceForm,
    InstitutionCreationForm,
    ManifestCreationForm,
  },
  data() {
    return {
      activeTab: 0,
      manifest: null,
      collectedPages: [],
    };
  },
  computed: {
    wizardLabel() {
      return "Témoin";
    },
    currentStep() {
      return this.stepItems[this.activeTab > -1 ? this.activeTab : 0];
    },
    stepItems() {
      return [
        {
          name: "classification",
          label: "Classification",
          next: "image-source-selection",
          left: {
            label: "left",
            component: "WitnessStatusTraditionForm",
            attributes: {},
          },
          center: { label: "center", component: "WitnessInputForm", attributes: {} },
        },
        {
          name: "institution-creation",
          next: "image-source-selection",
          prev: "classification",
          label: "Institution",
          center: {
            label: "center",
            component: "InstitutionCreationForm",
            attributes: {},
          },
          footer: {
            buttons: [],
          },
        },
        {
          name: "image-source-selection",
          prev: "classification",
          next: this.manifest ? "manifest-creation" : null,

          label: "Images",
          center: {
            label: "center",
            component: "ImageSourceForm",
            attributes: { collectedPages: this.collectedPages },
          },
          footer: {
            buttons: this.manifest
              ? []
              : [{ label: "Terminer", type: "is-primary", action: () => {} }],
          },
        },
        {
          name: "manifest-creation",
          prev: "image-source-selection",

          label: "Images",
          center: {
            label: "center",
            component: "ManifestCreationForm",
            attributes: { manifest: this.manifest, collectedPages: this.collectedPages },
          },
          footer: {
            buttons: [{ label: "Terminer", type: "is-primary", action: () => {} }],
          },
        },
      ];
    },
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
    setSourceManifest(m) {
      this.manifest = m;
    },
    manageManifestData({ action, data }) {
      console.log(`manifest[${action.name}]`, data);
      switch (action.name) {
        case "add":
          this.collectedPages = this.collectedPages.concat(data);
          break;
        case "del":
          if (data.index >= 0) {
            this.collectedPages.splice(data.index, 1);
          } else {
            this.collectedPages = [];
          }
          break;
        case "move":
          if (data.to !== data.from) {
            this.collectedPages.splice(
              data.to,
              0,
              this.collectedPages.splice(data.from, 1)[0]
            );
          }
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";

.root-container {
  overflow: hidden;

  min-width: 1100px;
  min-height: 720px;

  width: 1100px;
  height: 720px;

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
  }
  .center-footer-buttons-area {
    grid-area: center-footer-buttons;
    justify-self: end;
    align-self: center;
    .buttons {
      margin-right: 20px;
    }
  }

  .root-grid-container {
    display: grid;
    min-height: 100%;

    grid-template-columns: 300px auto;
    grid-template-rows: 120px auto 80px;
    grid-template-areas:
      "leftbar-header center-content center-content"
      "leftbar-content center-content  center-content"
      "leftbar-footer center-footer center-footer-buttons";
  }
}
</style>
