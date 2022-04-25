<template>
  <div class="create-person-form">
    <div class="block">
      <b-field label="Source">
        <b-radio v-model="source" name="source" native-value="wikidata" expanded>
          Wikidata
        </b-radio>
        <b-radio v-model="source" name="source" native-value="user" expanded>
          Saisie
        </b-radio>
      </b-field>
    </div>
    <div v-if="source === 'wikidata'">
      <b-field class="term-search">
        <div class="field has-addons">
          <div class="control">
            <input
              v-model="inputTerm"
              class="input"
              type="text"
              placeholder="Henri IV"
              @keyup.enter="fetchWikidataItems"
            />
          </div>
          <div class="control">
            <a class="button pl-5 pr-5" @click="fetchWikidataItems">
              <span class="icon">
                <i v-if="isFetching" class="fas fa-spinner fa-pulse" />
                <i v-else class="fas fa-search" />
              </span>
            </a>
          </div>
        </div>
      </b-field>

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
          <a v-if="props.row.item" :href="props.row.item" target="_blank">{{
            props.row.item
          }}</a>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">Aucun résultat</div>
        </template>

        <template #detail="props">
          {{ props.row }}
        </template>
      </b-table>
    </div>
    <div v-else>
      <b-field label="Nom">
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

    <b-message v-if="existsCount > 0" type="is-warning is-small" has-icon>
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

      //table
      tableData: [],
    };
  },
  computed: {
    canAdd() {
      return this.newPerson;
    },
    newPerson() {
      if (this.source === "wikidata") {
        return this.selected
          ? {
              ...this.selected,
              ref: this.selected.item,
            }
          : null;
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
          if (this.existsCount === 0) {
            this.selectNewPerson();
          }
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
        this.tableData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPerson(this.inputTerm);

        if (response.results.bindings) {
          this.tableData = response.results.bindings.map((b) => {
            console.log(b);
            return {
              item: b.human.value,
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

<style lang="scss">
.create-person-form {
  padding-left: 12px;
  min-width: 800px;

  .person-table {
    overflow-y: auto;
    max-height: 320px;

    td:hover {
      cursor: pointer;
    }
  }
  .description {
    font-style: lighter;
    &:first-letter {
      text-transform: uppercase;
    }
  }
}
.search-input .icon {
  top: -4px !important;
}
</style>
