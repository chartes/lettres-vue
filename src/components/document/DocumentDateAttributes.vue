<template>
  <div
    class="document-date__attributes"
    style="width: 100%"
  >
    <span
      v-if="editable"
      :class="editMode ? buttonFormat : 'edit-btn'"
      @click="enterEditMode"
    >
    </span>
    <!--<header class="document-date__attributes--title mb-3">
      <span class="heading">Dates de temps</span>
    </header>-->
    <div
      v-if="editable"
      class="creation-date"
    >
      <b-field
        label="Date de rédaction"
        label-position="inside"
        :type="!creationTmpIsValid ? 'is-danger' : null"
        :message="!creationTmpIsValid ? 'Format incorrect (AAAA-MM-JJ)' : null"
        @dblclick.native="enterEditMode"
      >
        <b-input
          v-model="creation"
          class="creation-date-input"
          name="creation"
          placeholder="1574-12-09"
          expanded
          :disabled="!editMode"
          @keyup.esc.native="cancelInput($event)"
        />
      </b-field>
      <b-field
        label="Étiquette"
        label-position="inside"
      >
        <b-input
          v-model="creationLabel"
          class="creation-date-input"
          name="creationLabel"
          placeholder="1574, 9 Décembre"
          expanded
          :disabled="!editMode"
          @keyup.esc.native="cancelInput($event)"
        />
      </b-field>
      <b-field
        label="Rédigée avant le"
        label-position="inside"
      >
        <b-input
          v-model="creationNotAfter"
          class="creation-date-input"
          name="creationNotAfter"
          placeholder="1575, 1er Janvier"
          expanded
          :disabled="!editMode"
          @keyup.esc.native="cancelInput($event)"
        />
      </b-field>
    </div>
    <div
      v-else
      class="creation-date"
    >
      <!--<b-field
        label="Date de rédaction"
        class="creation-date-input"
      >
        <span class="control">{{ creation }}</span>
      </b-field>-->
      <b-field
        label="Étiquette"
        class="creation-date-input"
      >
        <span class="control">{{ creationLabel }}</span>
      </b-field>
      <!--<b-field
        label="Rédigé avant le"
        class="creation-date-input"
      >
        <span class="control">{{ creationNotAfter }}</span>
      </b-field>-->
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
      editMode: false,
      buttonFormat: 'close-btn'
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
          //this.fieldChanged({ name: "creation", value });
          if (this.creationTmp !== this.document["creation"] || this.creationLabelTmp !== this.document["creation-label"] || this.creationNotAfterTmp !== this.document["creation-not-after"]) {
            this.buttonFormat = 'save-btn';
          } else {
            this.buttonFormat = 'close-btn';
          }
        }
      },
    },
    creationLabel: {
      get() {
        return this.creationLabelTmp;
      },
      set(value) {
        this.creationLabelTmp = value;
        //this.fieldChanged({ name: "creation-label", value });
        if (this.creationTmp !== this.document["creation"] || this.creationLabelTmp !== this.document["creation-label"] || this.creationNotAfterTmp !== this.document["creation-not-after"]) {
            this.buttonFormat = 'save-btn';
          } else {
            this.buttonFormat = 'close-btn';
          }
      },
    },
    creationNotAfter: {
      get() {
        return this.creationNotAfterTmp;
      },
      set(value) {
        this.creationNotAfterTmp = value;
        //this.fieldChanged({ name: "creation-not-after", value });
        if (this.creationTmp !== this.document["creation"] || this.creationLabelTmp !== this.document["creation-label"] || this.creationNotAfterTmp !== this.document["creation-not-after"]) {
            this.buttonFormat = 'save-btn';
          } else {
            this.buttonFormat = 'close-btn';
          }
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

    /*this.fieldChanged = debounce(async (fieldProps) => {
      const data = { id: this.document.id, attributes: {} };
      data.attributes[fieldProps.name] = fieldProps.value;
      //await this.$store.dispatch("document/save", data);
    }, 500);*/
  },
  methods: {
    maskCheck: function () {
      const isValidDate = !!Date.parse(this.creation);
      this.creationTmpIsValid = isValidDate;
      console.log("mask check", this.creationTmp, isValidDate);
    },
    cancelInput(evt) {
      console.log("Date event ", { ...evt });
      this.enterEditMode()
    },
    async enterEditMode() {
      console.log("this.editMode", this.editMode)
      this.editMode = !this.editMode
      if (this.buttonFormat === 'save-btn') {
        let saveData = (
            { id: this.document.id, attributes: {'creation': this.creationTmp, 'creation-label': this.creationLabelTmp, 'creation-not-after': this.creationNotAfterTmp}}
        );
        console.log("saveData : ", saveData);
        let resp = await this.$store.dispatch("document/save", saveData);
        console.log("resp", resp.status);
        this.buttonFormat = 'edit-btn'
      } else {
        this.buttonFormat = 'close-btn'
      }
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.creation-date {
  display: inline-flex;

  @include on-tablet {
    flex-direction: column;
    margin-left: 10px;
    margin-top: 10px;
  }

  .creation-date-input {
    margin-right: 30px;
    width: 200px;

    ::v-deep {
      input[type="text"] {
        padding: 22px 30px 5px 14px !important;
      }
      input[disabled] {pointer-events:none}
    }
  }

  .label {
    font-size: 12px !important;
  }
}
.edit-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  @include on-mobile {
    flex: 45px 0 0;
  }

  .icon.icon__pen-edit {
    display: none;
  }
}
.close-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/close_text.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  @include on-mobile {
    flex: 45px 0 0;
  }

  .icon.icon__pen-edit {
    display: none;
  }
}
.save-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/bouton_bouge.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  @include on-mobile {
    flex: 45px 0 0;
  }

  .icon.icon__pen-edit {
    display: none;
  }
}
</style>
