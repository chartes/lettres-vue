<template>
  <div>
    <section>
      <div
        class="row is-flex is-justify-content-space-between search-section-header-generic"
        :class="`search-section-header-${type}`"
      >
        <span class="advanced_search_header m-2">
          {{ title }}
        </span>
        <router-link
          :to="{ name: 'persons' }"
          active-class="is-active"
          class="advanced_search_router my-2"
        >
          Index
        </router-link>
      </div>
      <div class="row is-flex-direction-column my-5">
        <b-field>
          <b-taginput
            v-model="tags"
            :data="filteredTags"
            autocomplete
            field="label"
            :placeholder="allData.some(cat => cat[type].length > 0) ? placeholder : 'Élargir les critères'"
            icon="fas fa-search"
            clearable
            group-field="role_id"
            group-options="items"
            ellipsis
            @typing="updateFilteredTags"
          >
            <template #selected="props">
              {{ props.tags.label }}
            </template>
          </b-taginput>
        </b-field>
        <div>
          <span
            v-if="tags.length >0 " 
            class="suggestions-filter-list-title my-2"
          >
            <button
              class="suggestions-remove-all"
              @click="removeAllTags()"
            >
              <img src="../assets/images/icons/close-filter.svg">
            </button>
            filtres actifs
          </span>
          <div
            v-for="tag in tags.filter(pl => (pl.role_id === 1))"
            :key="tag.label"
            style="cursor: pointer"
            class="is-flex mb-1"
          >
            <!-- check why key is label, id not available ? -->
            <span id="tag_flag">EXP</span>
            <b-tag
              id="tag_label"
              :title="tag.label"
              :class="{selected: tag.isSelected === true}"
              closable
              @click.native="removeTag(tag)"
            >
              {{ tag.label }}
            </b-tag>
          </div>
          <div
            v-for="tag in tags.filter(pl => (pl.role_id === 2))"
            :key="tag.id"
            style="cursor: pointer"
            class="is-flex mb-1"
          >
            <span id="tag_flag">DES</span>
            <b-tag
              id="tag_label"
              :title="tag.label"
              :class="{selected: tag.isSelected === true}"
              closable
              @click.native="removeTag(tag)"
            >
              {{ tag.label }}
            </b-tag>
          </div>
          <div
            v-for="tag in tags.filter(pl => (pl.role_id === 3))"
            :key="tag.id"
            style="cursor: pointer"
            class="is-flex mb-1"
          >
            <span id="tag_flag">CIT</span>
            <b-tag
              id="tag_label"
              :title="tag.label"
              :class="{selected: tag.isSelected === true}"
              closable
              @click.native="removeTag(tag)"
            >
              {{ tag.label }}
            </b-tag>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";
import {value} from "lodash/seq";

export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: function (value) {
        return ['persons', 'places'].includes(value)
      }
    },
    title: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      filteredTags: [],
      selected: null,
      init: false,
    };
  },
  computed: {
    ...mapState("persons", {allPersons: "persons_roles"}),
    ...mapState("placenames", {allPlaces: "places"}),
    ...mapState("search", [
      "selectedPersonFrom",
      "selectedPersonTo",
      "selectedPersonCited",
      "selectedPlaceFrom",
      "selectedPlaceTo",
      "selectedPlaceCited"
    ]),
    allData: {
      get: function () {
        if (this.type === "persons") {
          return this.allPersons
        } else {
          return this.allPlaces
        }
      }
    },
    tags: {
      get: function () {
        if (this.type === "persons") {
          return [...this.selectedPersonFrom, ...this.selectedPersonTo, ...this.selectedPersonCited];
        } else {
          return [...this.selectedPlaceFrom, ...this.selectedPlaceTo, ...this.selectedPlaceCited];
        }
      },
      set: function (value) {
        this.updateFilters(value);
        this.performSearch();
        return value
      },
    }
  },
  methods: {
    value,
    ...mapActions("persons", ["fetchAll"]),
    ...mapActions("search", [
      "setSelectedPersonFrom",
      "setSelectedPersonTo",
      "setSelectedPersonCited", 
      "setSelectedPlaceFrom",
      "setSelectedPlaceTo",
      "setSelectedPlaceCited",
      "performSearch"
    ]),
    updateFilters(value) {
      const fromItems = value.filter(item => (item.role_id === 1))
      const toItems = value.filter(item => (item.role_id === 2))
      const citedItems = value.filter(item => (item.role_id === 3))
      if (this.type === "persons") {
        this.setSelectedPersonFrom(fromItems);
        this.setSelectedPersonTo(toItems);
        this.setSelectedPersonCited(citedItems);
      } else {
        this.setSelectedPlaceFrom(fromItems);
        this.setSelectedPlaceTo(toItems);
        this.setSelectedPlaceCited(citedItems);
      }
      this.performSearch();
    },
    updateFilteredTags(text) {
      const filter = (option) => option.label.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      const sorter = (a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase());
      const itemsFromFiltered = this.allData[0][this.type].filter(filter);
      itemsFromFiltered.sort(sorter);
      const itemsToFiltered = this.allData[1][this.type].filter(filter);
      itemsToFiltered.sort(sorter);
      const itemsCitedFiltered = this.allData[2][this.type].filter(filter);
      itemsCitedFiltered.sort(sorter);

      if (this.type === "persons") {
        this.filteredTags = [
            {role_id: "Expéditeur", items: itemsFromFiltered},
            {role_id: "Destinataire", items: itemsToFiltered},
            {role_id: "Personne citée", items: itemsCitedFiltered}
        ];
      } else {
        this.filteredTags = [
            {role_id: "Lieu d'expédition", items: itemsFromFiltered},
            {role_id: "Lieu de destination", items: itemsToFiltered},
            {role_id: "Lieu mentionné", items: itemsCitedFiltered}
        ];
      }
    },
    removeTag(tag) {
      if (!tag) {
        return
      }
      this.tags = this.tags.filter(item => (
        item.role_id === tag.role_id && item.label !== tag.label)
        || (item.role_id !== tag.role_id)
        )
    },
    removeAllTags() {
      this.tags = [];
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
div.dropdown-item {
  background-color: rgba(180, 0, 80);
  color: white;
}
#tag_label > span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
#tag_label {
  background-color: white;
  color: black;
}
#tag_flag {
  font-size: xx-small;
  font-weight: bolder;
  color: white;
  background-color: rgba(140, 140, 140) !important;
  border-radius: 3px;
  padding: 2px;
  display: inline-flex;
  align-items: center;
}
.search-section-header-generic {
  padding-left: 30px;
}
.search-section-header-persons {
  background: url('../assets/images/icons/picto-personnes.svg') center left no-repeat;
}
.search-section-header-places {
  background: url('../assets/images/icons/picto-lieux.svg') center left no-repeat;
}
.advanced_search_header {
  align-self: center;
}
.advanced_search_router {
  align-self: center;
  margin-left: auto;
}
i {
  color: rgba(140, 140, 140) !important;
}
.suggestions-filter-list-title {
  display: flex;
  align-items: center;
  gap: 5px
}
.suggestions-remove-all {
  border: none;
  background: none;
  cursor: pointer;
}
.suggestions-remove-all > img {
  height: 18px
}
</style>
