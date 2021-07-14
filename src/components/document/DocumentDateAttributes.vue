<template>
  <div class="document-date__attributes" style="width: 100%">
    <header class="document-date__attributes--title mb-3">
      <span class="heading">Dates de temps</span>
    </header>

    <div v-if="editable" class="creation-date">
      <b-field
        label="Date de rédaction"
        label-position="inside"
        :type="!creationTmpIsValid ? 'is-danger' : null"
        :message="!creationTmpIsValid ? 'Format incorrect (AAAA-MM-JJ)' : null"
      >
        <b-input
          v-model="creation"
          class="creation-date-input"
          name="creation"
          placeholder="1574-12-09"
          expanded
        />
      </b-field>
      <b-field label="Étiquette" label-position="inside">
        <b-input
          v-model="creationLabel"
          class="creation-date-input"
          name="creationLabel"
          placeholder="1574, 9 Décembre"
          expanded
        />
      </b-field>
      <b-field label="Rédigée avant le" label-position="inside">
        <b-input
          v-model="creationNotAfter"
          class="creation-date-input"
          name="creationNotAfter"
          placeholder="1575, 1er Janvier"
          expanded
        />
      </b-field>
    </div>
    <div v-else class="creation-date">
      <b-field label="Date de rédaction" class="creation-date-input">
        <span class="control">{{ creation }}</span>
      </b-field>
      <b-field label="Étiquette" class="creation-date-input">
        <span class="control">{{ creationLabel }}</span>
      </b-field>
      <b-field label="Rédigé avant le" class="creation-date-input">
        <span class="control">{{ creationNotAfter }}</span>
      </b-field>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { debounce } from "lodash";

export default {
  name: "DocumentAttributes",
  components: {},
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    editAttributes: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      creationLabelStatus: "normal",
      creationTmp: null,
      creationLabelTmp: null,
      creationNotAfterTmp: null,

      creationTmpIsValid: true,
    };
  },
  computed: {
    ...mapState("document", ["document"]),

    creation: {
      get() {
        return this.creationTmp;
      },
      set(value) {
        this.creationTmp = value;
        this.maskCheck();
        if (this.creationTmpIsValid) {
          this.fieldChanged({ name: "creation", value });
        }
      },
    },
    creationLabel: {
      get() {
        return this.creationLabelTmp;
      },
      set(value) {
        this.fieldChanged({ name: "creation-label", value });
      },
    },
    creationNotAfter: {
      get() {
        return this.creationNotAfterTmp;
      },
      set(value) {
        this.fieldChanged({ name: "creation-not-after", value });
      },
    },

    documentCreationLabel() {
      return this.document["creation-label"];
    },
    documentCreationNotAfter() {
      return this.document["creation-not-after"];
    },
  },
  watch: {
    "document.creation"() {
      this.creationTmp = this.document.creation;
    },
    documentCreationLabel() {
      this.creationLabelTmp = this.document["creation-label"];
    },
    documentCreationNotAfter() {
      this.creationNotAfterTmp = this.document["creation-not-after"];
    },
  },
  created() {
    this.creationTmp = this.document.creation;
    this.creationLabelTmp = this.document["creation-label"];
    this.creationNotAfterTmp = this.document["creation-not-after"];

    this.fieldChanged = debounce(async (fieldProps) => {
      const data = { id: this.document.id, attributes: {} };
      data.attributes[fieldProps.name] = fieldProps.value;
      await this.$store.dispatch("document/save", data);
    }, 500);
  },
  methods: {
    maskCheck: function () {
      const isValidDate = !!Date.parse(this.creation);
      this.creationTmpIsValid = isValidDate;
      console.log("mask check", this.creationTmp, isValidDate);
    },
  },
};
</script>

<style scoped lang="scss">
.creation-date {
  display: inline-flex;

  .creation-date-input {
    margin-right: 30px;
    width: 200px;
  }

  .label {
    font-size: 12px !important;
  }
}
</style>
