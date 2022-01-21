<template>
  <div class="create-person-form">
    <div class="columns">
      <div class="column">
        <div class="block">
          <b-field label="Source">
            <b-radio
              v-model="source"
              name="source"
              native-value="wikidata"
              expanded
            >
              Wikidata
            </b-radio>
            <b-radio
              v-model="source"
              name="source"
              native-value="user"
              expanded
            >
              Saisie
            </b-radio>
          </b-field>
        </div>
        <div v-if="source === 'wikidata'">
          <b-field label="Nom de la personne">
            <b-autocomplete
              v-model="inputTerm"
              :data="autocompleteData"
              placeholder="Catherine de Médicis"
              field="label"
              :loading="isFetching"
              class="search-input"
              clearable
              open-on-focus
              @typing="fetchWikidataItems"
              @select="(option) => (selected = option)"
            >
              <template slot-scope="props">
                <div class="is-light">
                  <div class="heading">
                    {{ props.option.label }}
                  </div>
                  <div class="">
                    {{ props.option.item }}
                  </div>
                  <div class="">
                    {{ props.option.description }}
                  </div>
                </div>
              </template>

              <template
                v-if="inputTerm"
                #empty
              >
                Aucun résultat pour {{ inputTerm }}
              </template>
            </b-autocomplete>
            <a
              class="button pl-5 pr-5"
              @click="fetchWikidataItems"
            >
              <span class="icon">
                <i class="fas fa-search" />
              </span>
            </a>
          </b-field>
        </div>
        <div v-else>
          <b-field label="Nom de la personne">
            <b-input
              v-model="personName"
              type="text"
              required
              placeholder="Catherine de Médicis"
            />
          </b-field>
          <b-field label="Identifiant de référence">
            <b-input
              v-model="refId"
              type="text"
              placeholder="https://www.wikidata.org/entity/Q640968"
            />
          </b-field>
        </div>

        <b-button
          type="is-primary is-light"
          :disabled="!newPerson"
          class="mt-3 is-pulled-right"
          @click="selectNewPerson"
        >
          Sélectionner
        </b-button>
      </div>
    </div>
    <b-message
      v-if="existsCount > 0"
      type="is-warning is-small"
      has-icon
    >
      Une personne possédant l'identifiant <b>{{ selected.item }}</b> existe déjà dans
      l'application.
    </b-message>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import { searchWikidataPerson } from "@/modules/sparql-helpers";

export default {
  name: "CreatePersonForm",
  components: {},
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-person-data"],
  data() {
    return {
      source: "wikidata",

      personName: null,
      refId: null,

      autocompleteData: [],
      selected: null,
      existsCount: 0,
      isFetching: false,
      inputTerm: "",
    };
  },
  computed: {
    canAdd() {
      return this.newPerson;
    },
    newPerson() {
      if (this.source === "wikidata") {
        return this.selected ? {
          ...this.selected,
          ref: this.selected.item
        } : null;
      } else {
        return this.personName
          ? {
              label: this.personName,
              ref: this.refId,
            }
          : null;
      }
    },
  },
  watch: {
    inputTerm() {},
    async selected() {
      if (this.selected) {
        if (this.selected.item) {
          this.existsCount = await this.$store.dispatch(
            "persons/checkIfRefExists",
            this.selected.item
          );
        } else {
          this.existsCount = 0;
        }
      }
    },
    source() {
      if (this.source !== "wikidata") {
        this.selected = null;
        this.inputTerm = null;
      }
    },
  },
  methods: {
    selectNewPerson() {
      this.managePersonData({
        action: { name: "set-person" },
        data: this.newPerson,
      });
    },

    fetchWikidataItems: debounce(async function () {
      if (this.inputTerm && this.inputTerm.length >= 2) {
        this.autocompleteData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPerson(this.inputTerm);

        if (response.results.bindings) {
          this.autocompleteData = response.results.bindings.map((b) => {
            console.log(b)
            return {
              item: b.human.value,
              label: b.humanLabel.value,
              description: b.humanDescription ? b.humanDescription.value : null
            };
          });
        }
        this.isFetching = false;
      }
    }, 500),

    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },
  },
};
</script>

<style lang="scss">
.create-person-form {
  padding-left: 12px;

  .map {
    height: 320px;
    width: 460px;
  }
}
.search-input .icon {
  top: -4px !important;
}
</style>
