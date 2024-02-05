<template>
  <div class="create-person-form">
    <div class="search-container mb-5">
      <span class="label">Chercher sur Wikidata</span>
      <b-field class="term-search">
        <div class="field has-addons">
          <b-input
            v-model="personNameWikidataInput"
            class="search_input"
            type="search"
            placeholder="Chercher sur Wikidata"
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="personNameWikidataInput = ''"
            @focus="$event.target.select()"
            @keyup.native.enter="fetchWikidataItems"
          />
          <div>
            <a
              class="button pl-5 pr-5 search_button"
              :disabled="!personNameWikidataInput || personNameWikidataInput === ''"
              @click="fetchWikidataItems"
            >
              <span class="icon">
                <i v-if="isFetching" class="fas fa-spinner fa-pulse" />
                <i v-else class="fas fa-search" />
              </span>
            </a>
          </div>
        </div>
      </b-field>
    </div>
    <div>
      <b-table
        ref="multiSortTable"
        :data="tableData"
        detail-key="label"
        show-detail-icon
        :narrowed="true"
        :mobile-cards="true"
        :selected.sync="selected"
        class="person-table"
      >
        <b-table-column v-slot="props" field="label" label="Nom">
          <div class="label">
            {{ props.row.label }}
          </div>
          <div class="description">
            {{ props.row.description }}
          </div>
        </b-table-column>

        <b-table-column v-slot="props" field="ref" label="Identifiant de référence">
          <span v-if="props.row.item">
            <a
              v-if="props.row.item.startsWith('http')"
              :href="props.row.item"
              target="_blank"
            >
              {{ props.row.item }}
            </a>
            <span v-else>
              {{ props.row.item }}
            </span>
          </span>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">Aucun résultat</div>
        </template>

        <template #detail="props">
          {{ props.row }}
        </template>
      </b-table>
    </div>

    <div class="search-container">
      <span class="label">Aucun résultat ? Ajoutez une nouvelle personne :</span>
      <b-field>
        <b-input
          v-model="personNameInput"
          class="search_input"
          type="search"
          placeholder="Personne inexistante sur Wikidata"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="personNameInput = ''"
        />
        <div class="hide">
          <a
            class="hide button pl-5 pr-5 search_button"
            :disabled="!personNameWikidataInput || personNameWikidataInput === ''"
            @click="fetchWikidataItems"
          >
            <span class="hide icon">
              <i v-if="isFetching" class="hide fas fa-spinner fa-pulse" />
              <i v-else class="hide fas fa-search" />
            </span>
          </a>
        </div>
      </b-field>

      <expanded-select
        v-if="personNameInput.length > 0"
        :items="filteredPersons"
        class="mt-2"
        @changed="selectionChanged"
        :selected-index="selectedPersonName"
      />

      <b-field label="Identifiant de référence" v-show="false">
        <b-input
          v-model="refId"
          type="text"
          placeholder="https://www.wikidata.org/entity/Q640968"
        />
      </b-field>
    </div>

    <b-message
      v-if="existsCount > 0 && refId"
      type="is-warning is-small"
      has-icon
    >
      Une personne possédant l'identifiant <b>{{ this.refId }}</b> }} existe déjà dans
      l'application.
    </b-message>
    <b-message
      v-else-if="existsCount > 0 && !refId"
      type="is-warning is-small"
      has-icon
    >
      Une personne similaire existe déjà dans l'application.
    </b-message>
  </div>
</template>

<script>
import {mapState} from "vuex";
import debounce from "lodash/debounce";
import { searchWikidataPerson } from "@/modules/sparql-helpers";
import ExpandedSelect from "@/components/ui/ExpandedSelect.vue";

export default {
  name: "CreatePersonForm",
  components: { ExpandedSelect },
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-person-data"],
  data() {
    return {
      personName: "",
      personNameInput: "",

      refId: null,

      autocompleteData: [],
      selected: null,
      existsCount: 0,
      existingPerson: {},
      isFetching: false,
      personNameWikidataInput: "",

      //table
      tableData: [],

      //manual
      selectedPersonName: null,
    };
  },
  computed: {
    ...mapState("persons", { allPersonsLabels: "persons"}),

    newPerson() {
      if (this.selected) {
        return this.selected
          ? {
              ...this.selected,
              ref: this.selected.item,
            }
          : null;
      } else {
        if (Object.keys(this.existingPerson).length > 0) {
          return this.existingPerson
              ? {
                ...this.existingPerson,
                ref: this.existingPerson.item,
              }
              : null;
        } else {
          if (this.personName && Object.keys(this.existingPerson).length === 0) {
            return {label: this.personName, ref: this.refId}
          } else {
            return null
          }
        }
      }
    },
    filteredPersons() {
      return this.allPersonsLabels.filter((option) => {
        return (
          option.toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.personNameInput.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0
        );
      });
    },
  },
  watch: {
    async selected() {
      this.reset()
      if (this.selected) {
        let _selected = this.selected
        if (this.selected.item) {
          this.selectedPersonName = null;
          await this.$store.dispatch(
            "persons/checkIfRefExists",
            this.selected.item
          ).then((response) => {
            this.existsCount = response.count;
            this.existingPerson = response.person
          });
          if (this.existsCount === 0) {
            this.selectNewPerson();
          } else {
            this.selected.id = this.existingPerson.id
            this.selected.label = this.existingPerson.attributes.label
            this.selected.item = this.existingPerson.attributes.ref
            this.selected.ref = this.existingPerson.attributes.ref
            this.selected.description = _selected.description ? _selected.description : ""
            this.selected.functions = this.existingPerson.attributes.functions

            //updating other variables
            this.refId = this.existingPerson.attributes.ref
          }
        } else {
          this.existsCount = 0;
        }
        this.selectNewPerson();
      }
    },
    personNameInput() {
      this.personName = this.personNameInput;
      this.personNameWikidataInput = "";
      this.selected = null;
      this.tableData = [];
      this.existingPerson = {};
      this.existsCount = 0;
      this.refId = null
      /*if (this.existsCount === 0) {
        this.selected = null;
      }*/
      this.selectNewPerson();
    },
    personNameWikidataInput(newVal, OldVal) {
      if (newVal === '') {
        this.personName = ''
        this.tableData = [];
        this.selected = null;
        this.existingPerson = {};
        this.existsCount = 0;
        this.refId = null
        this.selectNewPerson();
      }
    }
  },
  methods: {
    selectNewPerson() {
      this.managePersonData({
        action: { name: "set-person" },
        data: this.personNameInput && !this.selected ? {...this.newPerson, "initialLabel": this.personNameInput} : this.newPerson
      });
    },
    reset() {
      this.personName = '';
      this.existingPerson = {};
      this.existsCount = 0;
      this.refId = null;
      //this.personNameWikidataInput = ""
      this.personNameInput = ""
    },

    async selectionChanged(evt) {
      this.existsCount = 0
      this.personName = evt.item;
      this.selectedPersonName = evt.index;
      this.existingPerson = {}
      let responsePerson = {}
      await this.$store.dispatch("persons/search", this.personName)
          .then((response) => {
            this.existsCount = response.response.meta["total-count"];
            this.responsePerson = response.response.data[0] ? response.response.data[0] : null
          });
      if (this.existsCount === 0) {
        this.selected = null;
      } else {
        this.existingPerson.id = this.responsePerson.id
        this.existingPerson.label = this.responsePerson.attributes.label
        this.existingPerson.ref = this.responsePerson.attributes.ref
        this.existingPerson.item = this.responsePerson.attributes.ref
        this.existingPerson.functions = this.responsePerson.attributes.functions

        this.refId = this.responsePerson.attributes.ref
      }
      this.selectNewPerson();
    },

    fetchWikidataItems: debounce(async function () {
      if (this.personNameWikidataInput && this.personNameWikidataInput.length >= 2) {
        this.personNameInput = '';
        this.tableData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPerson(this.personNameWikidataInput);

        if (response.results.bindings) {
          this.tableData = response.results.bindings.map((b) => {
            //console.log(b);
            return {
              item: b.human.value.replace("http:", "https:"),
              label: b.humanLabel.value,
              description: b.humanDescription ? b.humanDescription.value : null,
            };
          });
        }
        this.isFetching = false;
      }
    }, 300),

    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.create-person-form {
  .person-table {
    overflow-y: auto;
    max-height: 320px;

    td:hover {
      cursor: pointer;
    }
  }
  .description {
    font-weight: lighter;
    &:first-letter {
      text-transform: uppercase;
    }
  }
}

.search-container input {
  width: 100% !important;
  vertical-align: center;
}
.hide {
  visibility: hidden !important;
}
.control, .search_input {
  width: 100% !important;
  margin-right: 1px !important;

  ::v-deep .icon {
    padding: 0px !important;
  }

  ::v-deep input {
    //border-right-color: #FFFFFF !important;
    border-bottom-right-radius: 4px !important;
    border-top-right-radius: 4px !important;
    height: 100%;
    padding-top: 2px;
    padding-bottom: 2px;

    font-family: $family-primary;
    font-size: 18px;
    font-weight: 400;
    color: #343434;

    @include on-mobile {
      font-size: 15px;
    }

    &:hover,
    &:focus {
      border-bottom-right-radius: 4px !important;
      border-top-right-radius: 4px !important;
      //border-right-color: transparent !important;
      box-shadow: none !important;
    }
  }
}
.search_button {
  border-color: white !important;
  outline: none !important;
  box-shadow: none !important;
  color: rgba(127, 0, 56) !important;
  //border-bottom-left-radius: 0px !important;
  //border-top-left-radius: 0px !important;

  &.pl-5 {
    @include on-mobile {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }

  i.fa-search {
    text-indent: -9999px;
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url(../../../assets/images/icons/loupe_header.svg) center / contain no-repeat;

    @include on-mobile {
      width: 20px;
      height: 20px;
    }
  }
}

</style>
