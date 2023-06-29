<template>
  <div class="root-container box modal-card">
    <div class="root-grid-container">
      <div class="leftbar-header-area">
        <h1 class="step-label">
          {{ wizardLabel }}
        </h1>
        <h2
          v-if="currentStep.label"
          class="step-label"
        >
          {{ currentStep.label }}
        </h2>
      </div>

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
                @manage-manifest-data="manageManifestData"
                @manage-witness-data="manageWitnessData"
                @add-note="addNote"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="leftbar-content-area">
        <b-tabs
          v-model="activeTab"
          :animated="false"
        >
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
                @manage-manifest-data="manageManifestData"
                @manage-witness-data="manageWitnessData"
              />
            </keep-alive>
          </b-tab-item>
        </b-tabs>
      </div>

      <div class="leftbar-footer-area" />
      <div class="nav-footer-area">
        <div class="buttons">
          <b-button
            type="is-primary"
            size="is-medium"
            @click="closeWizard"
          >
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

          <span
            v-for="(stepItem, i) in stepItems"
            :key="`footer-buttons-step-${i}`"
          >
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
  props: {
    witnessInput: {
      type: Object,
      default: () => {
        return {
          status: ["base"],
          tradition: [null],
          institution: null,
          "classification-mark": null,
          content: null,
        };
      },
    },
  },
  emits: ['add-note'],
  data() {
    return {
      activeTab: 0,
      witness: {
        status: ["base"],
        tradition: [null],
        institution: null,
        "classification-mark": null,
        content: null,
      },
      manifestUrl: null,
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
      const w = this.$props.witnessInput;

      return [
        {
          name: "classification",
          label: "Définition",
          next: "image-source-selection",
          left: {
            label: "left",
            component: "WitnessStatusTraditionForm",
            attributes: { witness: this.witness },
          },
          center: {
            label: "center",
            component: "WitnessInputForm",
            attributes: { witness: this.witness },
          },
        },
        {
          name: "institution-creation",

          prev: "classification",
          label: "Institution",
          center: {
            label: "center",
            component: "InstitutionCreationForm",
            attributes: { witness: this.witness },
          },
          footer: {
            buttons: [],
          },
        },
        {
          name: "image-source-selection",
          prev: "classification",
          next: this.manifest || this.collectedPages.length ? "manifest-creation" : null,

          label: "Sélection des images",
          center: {
            label: "center",
            component: "ImageSourceForm",
            attributes: {
              collectedPages: this.collectedPages,
              manifestUrl: this.manifestUrl,
            },
          },
          footer: {
            buttons:
              this.manifest || this.collectedPages.length
                ? []
                : [{ label: "Terminer", type: "is-primary", action: this.saveWitness }],
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
            buttons: [
              {
                label: "Terminer",
                type: "is-primary",
                action: this.saveWitness,
              },
            ],
          },
        },
      ];
    },
  },
  async created() {
    if (this.$props.witnessInput) {
      const w = this.$props.witnessInput;
      this.witness = {
        status: [w.status],
        tradition: [w.tradition],
        institution: w.institution,
        "classification-mark": w["classification-mark"],
        content: w.content,
      };
      this.manifestUrl = w["manifest-url"];

      if (this.witnessInput.id) {
        this.witness.id = this.witnessInput.id;
      }

      if (this.manifestUrl) {
        const r = await fetch(this.manifestUrl);
        this.manifest = await r.json();
        //TODO: should I fetch the 'origin' manifest there after ?

        let num = 1;
        for (const canvas of this.manifest.sequences[0].canvases) {
          this.collectedPages.push({
            thumbnail: { url: canvas.thumbnail["@id"] },
            title: canvas.label,
            fullUrl: canvas.images[0].resource["@id"],
            num,
            canvasId: canvas["@id"],
          });
          num += 1;
        }

        console.log("collectedPages", this.collectedPages);
      }
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
    manageManifestData({ action, data }) {
      console.log(`manifest[${action.name}]`, data);
      switch (action.name) {
        case "set":
          this.manifest = data.manifest;
          break;
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
    manageWitnessData({ action, data }) {
      console.log(`witness[${action.name}]`, data);
      switch (action.name) {
        case "set-status":
          this.witness.status = data.id;
          break;
        case "set-tradition":
          this.witness.tradition = data.id;
          break;
        case "set-institution":
          this.witness.institution = data;
          break;
        case "set-classification-mark":
          this.witness["classification-mark"] = data;
          break;
        case "set-witness-text-content":
          this.witness.content = data;
          break;
        default:
          break;
      }
    },
    closeWizard() {
      if (this.$parent.close) {
        this.$parent.close();
      }
    },
    async saveWitness() {
      if (this.witness && !!this.witness.content) {
        this.witness.images = this.collectedPages.map((p) => p.canvasId);
        if (this.witness.id) {
          await this.$store.dispatch("document/updateWitness", this.witness);
        } else {
          await this.$store.dispatch("document/addWitness", this.witness);
        }
      }
      this.closeWizard();
    },
    addNote(event) {
      this.$emit('add-note', event)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

.root-container {
  overflow: hidden;
  width: 100% !important;
  min-height: 720px;
  min-width: 960px;
  height: inherit;
  padding: 0 !important;
  background: transparent !important;

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

    ::v-deep {
      .table tr.is-selected,
      .expanded-select dt.expanded-selection {
        background-color: #CB2158;
      }

      .table tr.is-selected > * {
        color: #FFF;
      }
    }
  }

  .previous-button {
    margin-left: 40px;
  }

  /* Grid */
  .root-grid-container {
    display: grid;
    min-height: inherit;
    height: 100%;
    background: none;

    grid-template-columns: minmax(800px, auto) minmax(280px, 28%);
    grid-template-rows: 62px auto 80px;
    grid-template-areas:
      "leftbar-header leftbar-header"
      "center-content leftbar-content"
      "leftbar-footer nav-footer";

    @include on-tablet {
      grid-template-columns: auto;
      grid-template-rows: 62px auto auto 80px;
      grid-template-areas:
      "leftbar-header"
      "center-content"
      "leftbar-content"
      "nav-footer";
    }
  }

  .leftbar-header-area {
    grid-area: leftbar-header;
  }

  .leftbar-header-area {
    display: flex;
    align-items: center;
    gap: 0;

    background-color: #CB2158;
    border: none;
    border-radius: 5px;
    padding: 3px 20px;
    margin-bottom: 10px;

    h1,
    h2 {
      padding: 0;
      margin: 0 !important;
      font-family: $family-apptitle;
      font-size: 30px !important;
      color: #FFFFFF;
      font-weight: 200;
      letter-spacing: 0;
    }

    h2 {
      text-transform: none !important;

      &::before {
        content: ":";
        margin: 0 5px;
      }
    }
  }

  .leftbar-content-area,
  .nav-footer-area {
    background-color: #7F0038 !important;
    margin-left: 10px;
  }

  .leftbar-content-area {
    grid-area: leftbar-content;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    .b-tabs {
      ::v-deep {

        .tab-content {
          background-color: #CB2158;
          color: #FFF;

          .heading {
            text-transform: none !important;
          }

          .labels {
            padding: 0;
            border: none;

            .is-size-5 {
              font-size: 16px !important;
            }
          }

        }
      }
    }
  }

  .leftbar-footer-area {
    grid-area: leftbar-footer;
    background-color: #FFFFFF;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @include on-tablet {
      display: none;
    }

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
    background-color: #FFFFFF;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    & > .b-tabs {
      height: 100%;

      ::v-deep {
        .tabs li > a {
          font-family: $family-primary;
          font-size: 18px;
          color: #7F0038;
          font-weight: 500;
          text-transform: uppercase;

          @include on-mobile {
            padding: 5px 8px 5px 5px;
            font-size: 13px;
          }
        }

        .tab-content {
          padding: 10px 0;
        }

        .tab-content,
        .tab-item {
          height: 100%;
        }
      }
    }
  }

  .nav-footer-area {
    grid-area: nav-footer;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    position: relative;

    .buttons {
      position: absolute;
      bottom: 40px;

      display: flex;
      justify-content: center;
      align-items: center;

      @include on-tablet {
        bottom: 15px;
      }

      @include on-mobile {
        bottom: 20px;
        width: 100%;
        padding: 0 10px;
        justify-content: flex-end;
      }

      button {
        width: 140px;
        margin: 10px !important;
        background-color: #CB2158;

        @include on-mobile {

          font-size: 14px;

          &.button {
            width: auto;
            margin: 10px 3px !important;
          }

          &.previous-button,
          &.next-button {
            text-indent: -9999px;
            width: 50px;
            padding: 0 5px;
          }

          &.previous-button:after,
          &.next-button:after {
            content: "";
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(#{$image-path}/icons/suivant.svg) center right / 16px auto no-repeat;
            transform-origin: 50% 50%;
          }

          &.previous-button:after {
            transform: rotate(-180deg);
          }
        }
      }
    }
  }
}

.root-container::v-deep .b-tabs .tabs:first-of-type {
  display: none !important;
}
</style>
