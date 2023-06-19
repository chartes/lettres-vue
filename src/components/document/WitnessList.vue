<template>
  <div>
    <div class="witness-list">
      <draggable
        v-model="witnessTmpList"
        class="list-group"
        tag="ul"
        handle=".handle"
        v-bind="dragOptions"
        @start="drag = true"
        @end="dragEnd"
      >
        <transition-group
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <li
            v-for="witness in witnessTmpList"
            :key="witness.id"
            class="list-group-item"
          >
            <span class="columns is-flex-direction-column">
              <div class="column">
                <div v-html="witness.content" />
                <div v-html="witness['classification-mark']" />
              </div>
              <div class="column">
                <div class="witness-actions">
                  <b-field
                    grouped
                    group-multiline
                  >
                    <div class="controls">
                      <div class="control">
                        <b-taglist attached>
                          <b-tag>status</b-tag>
                          <b-tag type="is-success is-light">
                            {{ witness.status }}
                          </b-tag>
                        </b-taglist>
                      </div>
                      <div
                        v-if="witness.tradition"
                        class="control"
                      >
                        <b-taglist attached>
                          <b-tag>tradition</b-tag>
                          <b-tag type="is-success is-light">
                            {{ witness.tradition }}
                          </b-tag>
                        </b-taglist>
                      </div>
                      <div
                        v-if="witness.institution"
                        class="control"
                      >
                        <b-taglist attached>
                          <b-tag>institution</b-tag>
                          <b-tag type="is-success is-light">
                            {{ witness.institution.name }}
                          </b-tag>
                        </b-taglist>
                      </div>
                    </div>
                    <div class="buttons">
                      <b-field v-if="editable">
                        <div class="field has-addons">
                          <p class="handle control">
                            <button class="button is-small is-light arrows-btn">
                              <span class="icon is-small">
                                <i class="fas fa-arrows-alt" />
                              </span>
                            </button>
                          </p>
                          <p class="control">
                            <button
                              class="button is-small is-light edit-btn"
                              @click="
                                () => {
                                  selectedWitness = witness;
                                  isComponentModalActive = true;
                                }
                              "
                            >
                              <span class="icon is-small">
                                <i class="fas fa-edit" />
                              </span>
                            </button>
                          </p>
                          <p class="control">
                            <button
                              class="button is-small is-danger is-light trash-btn"
                              @click="deleteWitness(witness)"
                            >
                              <span class="icon is-small">
                                <i class="fas fa-trash-alt" />
                              </span>
                            </button>
                          </p>
                        </div>
                      </b-field>
                      <b-field>
                        <p class="control">
                          <button
                            rounded
                            class="button is-small display-manifest-button eye-btn"
                            :class="
                              displayedWitness && displayedWitness.id === witness.id
                                ? 'is-success'
                                : 'is-light'
                            "
                            @click="showWitness(witness)"
                          >
                            <span class="icon is-small">
                              <i class="far fa-eye" />
                            </span>
                          </button>
                        </p>
                      </b-field>
                    </div>
                  </b-field>
                </div>
              </div>
            </span>
          </li>
        </transition-group>
      </draggable>

      <b-modal
        v-model="isComponentModalActive"
        trap-focus
        has-modal-card
        :can-cancel="['escape', 'x']"
        scroll="clip"
        :width="1080"
        :destroy-on-hide="true"
        aria-role="dialog"
        aria-label="Modification du témoin"
        aria-modal
      >
        <template #default="props">
          <witness-wizard-form
            :witness-input="selectedWitness"
            @add-note="addNote"
            @close="
              () => {
                props.close();
                selectedWitness = null;
              }
            "
          />
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WitnessWizardForm from "@/components/forms/wizards/WitnessWizardForm";
import draggable from "vuedraggable";

export default {
  name: "WitnessList",
  components: {
    draggable,
    WitnessWizardForm,
  },
  props: {
    openModal: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
  },
  emits: ["close-witness-modal", "add-note"],
  data() {
    return {
      drag: false,
      isComponentModalActive: false,
      selectedWitness: null,
      displayedWitness: null,
      witnessTmpList: [],
    };
  },
  computed: {
    ...mapState("document", ["witnesses", "document"]),

    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  watch: {
    openModal() {
      if (this.openModal) {
        this.selectedWitness = null;
        this.isComponentModalActive = true;
      }
    },
    isComponentModalActive() {
      if (!this.isComponentModalActive) {
        this.$emit("close-witness-modal");
      }
    },
    witnesses() {
      this.witnessTmpList = this.witnesses;
      //this.displayedWitness = this.witnessTmpList ? this.witnessTmpList[0] : null;
    },
  },
  created() {
    this.witnessTmpList = this.witnesses;
    if (this.witnessTmpList.length > 0) {
      // this.showWitness(this.witnessTmpList[0], false);
    }
  },
  methods: {
    ...mapActions("layout", [
      "showRightSideBar",
      "setDisplayedManifestUrl",
      "toggleRightSideBar",
    ]),
    async recomputeOrder() {
      this.witnessTmpList.forEach((element, i) => {
        element.num = i + 1;
      });
      await this.$store.dispatch("document/reorderWitnesses", {
        witnesses: this.witnessTmpList,
      });
      await this.$store.dispatch("document/fetch", this.document.id);
    },
    async deleteWitness(witness) {
      if (witness && witness.id) {
        await this.$store.dispatch("document/removeWitness", witness);
        this.recomputeOrder();
      }
    },
    showWitness(witness, forceSideBar = true) {
      if (this.displayedWitness && witness.id === this.displayedWitness.id) {
        this.toggleRightSideBar();
        this.displayedWitness = null;
      } else {
        this.displayedWitness = witness;
        if (forceSideBar) {
          this.showRightSideBar();
        }
        this.setDisplayedManifestUrl(witness["manifest-url"]);
      }
    },
    dragEnd() {
      this.drag = false;
      this.recomputeOrder();
    },
    addNote(event) {
      console.log('witness list')
      this.$emit('add-note', event)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.witness-list {
  display: inline-block;
  margin-bottom: 20px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  border-radius: 2px;
  padding-left: 4px;
  padding-right: 4px;
  background: $nice-grey;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #FDB3CC;
  margin-bottom: 20px;

  @include on-tablet {
    padding-top: 0;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  .columns {
    margin: 0 !important;
  }

  .column {
    padding: 0 5px 5px;

    @include on-tablet {
    }
  }
}

.list-group-item i {
  cursor: pointer;
}

.witness-actions {
  display: inline-flex;
  width: 100%;

  ::v-deep {
    & > .field {
      width: 100%;

      .field-body {
        .field.is-grouped {
          justify-content: space-between;
          width: 100%;

          @include on-mobile {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 0;
          }

          .controls {
            display: flex;
            gap: 5px;

            .control {
              font-family: $family-primary;
              font-weight: 400;
              text-transform: uppercase;

              &:not(:last-child) .tags:after {
                content: "|";
                margin: 0 5px 0 8px;
              }

              .tags {
                gap: 2px;

                & > .tag:first-child > span {
                  font-size: 16px;
                  color: #71757B;

                  @include on-mobile {
                    font-size: 13px;
                  }

                  &:after {
                    content: ":";
                    margin: 0 3px;
                  }
                }
                & > .tag:not(body).is-success.is-light {
                  background: none;
                  font-size: 16px;
                  color: #363636;

                  @include on-mobile {
                    font-size: 13px;
                  }
                }
              }
            }
          }

          .buttons {
            display: flex;

            .field {
              margin-right: 0;

              .control {
                width: 29px;
                margin-left: 20px;

                @include on-mobile {
                  margin-left: 0;
                  margin-right: 20px;
                }
              }

              .button {
                width: 100%;
                padding: 0;
                background-color: transparent;

                span.icon {
                  display: inline-block;
                  width: 25px;
                  height: 25px;
                  margin: 0;
                  padding: 0;
                  background-repeat: no-repeat;
                  background-position: center;

                  & > i {
                    display: none;
                  }
                }

                &.arrows-btn span.icon {
                  background-image: url(../../assets/images/icons/bouton_bouge.svg);
                }

                &.trash-btn span.icon {
                  background-image: url(../../assets/images/icons/bouton_supprimer_sans_bord.svg);
                }

                &.edit-btn span.icon {
                  background-image: url(../../assets/images/icons/bouton_edit.svg);
                }

                &.eye-btn span.icon {
                  width: 29px;
                  background-image: url(../../assets/images/icons/bouton_voir.svg);
                }
              }
            }
          }
        }
      }
    }
  }
}
.display-manifest-button {
  width: 52px;
}
</style>
