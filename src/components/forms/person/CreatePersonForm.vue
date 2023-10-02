<template>
  <div class="create-person-form is-flex-direction-column">
    <div class="mb-5">
      <span class="label">Chercher sur Wikidata</span>
      <b-field class="term-search">
        <div class="field has-addons">
          <div class="control">
            <input
              v-model="personNameWikidataInput"
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
          <span v-if="props.row.item">
            <a
              v-if="props.row.item.startsWith('http')"
              :href="props.row.item"
              target="_blank"
              >{{ props.row.item }}</a
            >
            <span v-else>{{ props.row.item }}</span>
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

    <div>
      <b-field label="Aucun résultat ? Ajoutez une nouvelle personne :" class="mt-2">
        <b-input
          v-model="personNameInput"
          type="text"
          placeholder="Henri IV"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="personNameInput = ''"
          style="max-width: 360px"
        />
      </b-field>

      <expanded-select
        :items="filteredPersons"
        class="mt-2"
        @changed="selectionChanged"
        :selected-index="selectedPersonName"
        style="max-height: 120px"
      />

      <b-field label="Identifiant de référence" v-show="false">
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
import { mapState } from "vuex";
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
    ...mapState("persons", { allPersons: "persons" }),

    newPerson() {
      if (this.selected) {
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
    filteredPersons() {
      return this.allPersons.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(this.personNameInput.toLowerCase()) >= 0
        );
      });
    },
  },
  watch: {
    async selected() {
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
            this.selected.label = this.existingPerson.attributes.label
            this.selected.item = this.existingPerson.attributes.ref
            this.selected.description = _selected.description ? _selected.description : ""
            this.personNameInput = this.existingPerson.attributes.label
            this.newPerson.id = this.existingPerson.id
            this.selectedPersonName = this.filteredPersons.findIndex((personLabel) => personLabel === this.existingPerson.attributes.label)
          }
        } else {
          this.existsCount = 0;
        }
      }
    },
    personNameInput() {
      this.personName = this.personNameInput;
      this.personNameWikidataInput = "";
      if (!this.existingPerson) {
        this.selected = null;
      }
      this.selectNewPerson();
    },
  },
  methods: {
    selectNewPerson() {
      this.managePersonData({
        action: { name: "set-person" },
        data: this.newPerson,
      });
    },

    selectionChanged(evt) {
      this.personName = evt.item;
      this.selectedPersonName = evt.index;
      if (!this.existingPerson) {
        this.selected = null;
      }
      this.selectNewPerson();
    },

    fetchWikidataItems: debounce(async function () {
      if (this.personNameWikidataInput && this.personNameWikidataInput.length >= 2) {
        this.tableData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPerson(this.personNameWikidataInput);

        if (response.results.bindings) {
          this.tableData = response.results.bindings.map((b) => {
            console.log(b);
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

<style lang="scss">
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

  input[type="text"] {
    height: 100%;
  }

  a.button {
    padding-top: 0;
    padding-bottom: 0;
  }

}
.search-input .icon {
  top: -4px !important;
}

</style>
