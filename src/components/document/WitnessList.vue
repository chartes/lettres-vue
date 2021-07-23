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
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li v-for="witness in witnessTmpList" :key="witness.id" class="list-group-item">
            <span class="columns">
              <div class="column">
                <div v-html="witness.content" />
                <div v-html="witness['classification-mark']" />
              </div>
              <div class="column is-two-fifths">
                <div class="witness-actions">
                  <b-field grouped group-multiline>
                    <div class="control">
                      <b-taglist attached>
                        <b-tag>status</b-tag>
                        <b-tag type="is-success is-light">
                          {{ witness.status }}
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div v-if="witness.tradition" class="control">
                      <b-taglist attached>
                        <b-tag>tradition</b-tag>
                        <b-tag type="is-success is-light">
                          {{ witness.tradition }}
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div v-if="witness.institution" class="control">
                      <b-taglist attached>
                        <b-tag>institution</b-tag>
                        <b-tag type="is-success is-light">
                          {{ witness.institution.name }}
                        </b-tag>
                      </b-taglist>
                    </div>
                    <b-field>
                      <div class="field has-addons">
                        <p class="handle control">
                          <button class="button is-small is-light">
                            <span class="icon is-small">
                              <i class="fas fa-arrows-alt" />
                            </span>
                          </button>
                        </p>
                        <p class="control">
                          <button
                            class="button is-small is-light"
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
                            class="button is-small is-danger is-light"
                            @click="deleteWitness(witness)"
                          >
                            <span class="icon is-small">
                              <i class="fas fa-trash-alt" />
                            </span>
                          </button>
                        </p>
                      </div>
                    </b-field>
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
import { mapState } from "vuex";
import WitnessWizardForm from "@/components/forms/wizards/WitnessWizardForm";
import draggable from "vuedraggable";

export default {
  name: "WitnessList",
  emits: ["close-witness-modal"],
  components: {
    draggable,
    WitnessWizardForm,
  },
  props: {
    openModal: { type: Boolean, default: false },
  },
  data() {
    return {
      drag: false,
      isComponentModalActive: false,
      selectedWitness: null,
      witnessTmpList: [],
    };
  },
  computed: {
    ...mapState("document", ["witnesses"]),

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
    },
  },
  created() {
    this.witnessTmpList = this.witnesses;
  },
  methods: {
    recomputeOrder() {
      this.witnessTmpList.forEach((element, i) => {
        element.num = i + 1;
      });
    },
    async deleteWitness(witness) {
      if (witness && witness.id) {
        await this.$store.dispatch("document/removeWitness", witness);
        this.recomputeOrder();
      }
    },
    dragEnd() {
      this.drag = false;
      this.witnessTmpList.forEach((element, i) => {
        element.num = i + 1;
      });
      this.recomputeOrder();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.witness-list {
  display: inline;
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
  padding-top: 12px;
  padding-bottom: 17px;
  border-bottom: 1px solid #f2f2f2;
}

.list-group-item i {
  cursor: pointer;
}

.witness-actions {
  display: inline-flex;
  float: right;
  width: max-content;
}
</style>
