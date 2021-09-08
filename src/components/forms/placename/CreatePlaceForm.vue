<template>
  <div class="create-place-form">
    <b-field label="Chercher un lieu sur Wikidata">
      <b-autocomplete
        v-model="inputTerm"
        :data="tableData"
        placeholder="e.g. Metz"
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
              {{ props.option.label }} ({{ props.option.coords }})
            </div>
            <div class="is-size-7">
              {{ props.option.item }}
            </div>
          </div>
        </template>

        <template v-if="inputTerm" #empty> Aucun résultat pour {{ inputTerm }} </template>
      </b-autocomplete>
    </b-field>

    <article class="selected-placename">
      <div v-if="selected" class="is-light">
        <div class="heading">
          {{ selected.label }}
        </div>
        <div class="is-size-7">
          {{ selected.item }}
        </div>
        <my-awesome-map :lat-lng="selected.coords" />
      </div>
    </article>

    <b-message v-if="existsCount > 0" type="is-warning is-small" has-icon>
      Un lieu possédant l'identifiant <b>{{ selected.item }}</b> existe déjà dans
      l'application.
    </b-message>

    <b-button
      class="add-placename"
      type="is-primary is-pulled-right"
      :disabled="!canAdd"
      @click="addPlacename"
    >
      Ajouter au référentiel
    </b-button>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import { mapState, mapActions, mapGetters } from "vuex";
import { searchWikidataPlacename } from "@/modules/sparql-helpers";
import MyAwesomeMap from "@/components/MyAwesomeMap.vue";

export default {
  name: "CreatePlaceForm",
  components: {
    MyAwesomeMap,
  },
  emit: ["manage-placename-data"],
  data() {
    return {
      tableData: [],
      selected: null,
      existsCount: 0,
      isFetching: false,
      inputTerm: "",
    };
  },
  computed: {
    canAdd() {
      return this.selected;
    },
  },
  watch: {
    inputTerm() {},
    async selected() {
      if (this.selected) {
        if (this.selected.item) {
          this.existsCount = await this.$store.dispatch(
            "placenames/checkIfRefExists",
            this.selected.item
          );
        } else {
          this.existsCount = 0;
        }
      }
    },
  },
  async created() {},
  methods: {
    fetchWikidataItems: debounce(async function () {
      if (this.inputTerm && this.inputTerm.length >= 2) {
        this.tableData = [];
        this.isFetching = true;
        this.selected = null;
        const response = await searchWikidataPlacename(this.inputTerm);

        if (response.results.bindings) {
          this.tableData = response.results.bindings.map((b) => {
            let coordsTmp = b.coords ? b.coords.value.split("(")[1] : null;
            if (coordsTmp) {
              coordsTmp = coordsTmp.slice(0, coordsTmp.length - 1).split(" ");
              coordsTmp = [parseFloat(coordsTmp[1]), parseFloat(coordsTmp[0])];
            }

            return {
              item: b.item.value,
              coords: coordsTmp,
              label: b.label.value,
            };
          });
        }
        this.isFetching = false;
      }
    }, 500),

    async addPlacename() {
      if (this.canAdd) {
        let long = null;
        let lat = null;
        if (this.selected.coords) {
          long = this.selected.coords[0];
          lat = this.selected.coords[1];
        }

        const response = await this.$store.dispatch("placenames/addOne", {
          label: this.selected.label,
          ref: this.selected.item,
          long,
          lat,
        });

        console.log("response (add place):", response);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create-place-form {
  padding-left: 12px;
  width: 800px;

  .search-input {
    max-width: 520px;
  }

  .add-placename {
  }

  .selected-placename {
    min-height: 220px;
  }
}
</style>
