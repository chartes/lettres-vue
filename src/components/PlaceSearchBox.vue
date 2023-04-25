<template>
  <div>
    <section>
      <div class="row is-flex is-justify-content-space-between search-section-header-places">
        <span class="advanced_search_header m-2">LIEUX</span>
        <router-link
          :to="{ name: 'places' }"
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
            :placeholder="allPlaces.some(cat => cat.places.length > 0) ? 'Paris' : 'Elargir les critères'"
            icon="fas fa-search"
            clearable
            group-field="role_id"
            group-options="places"
            ellipsis
            append-to-body
            @typing="getFilteredTags"
          >
            <template #selected="props">
              {{ props.tags.label }}
            </template>
          </b-taginput>
        </b-field>
        <div>
          <span v-if="tags.length >0 ">filtres actifs</span>
          <div
            v-for="tag in tags.filter(pl => (pl.role_id === 1))"
            :key="tag.id"
            style="cursor: pointer"
            class="is-flex mb-1"
          >
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
      <!-- Display the Tags array :<pre style="max-height: 400px"><b>Tags:</b>{{ tags }}</pre> -->
    </section>
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex";
import {value} from "lodash/seq";

export default {
  data() {
    return {
      selectOutside: false,
      filteredTags: [],
      isSelectOnly: false,
      tags: [],
      selected: null,
      init: false,
    };
  },
  computed: {
    ...mapState("placenames", {allPlaces: "places"}),
    ...mapState("search", ["selectedPlaceFrom","selectedPlaceTo","selectedPlaceCited", "selectedPersonFrom","selectedPersonTo","selectedPersonCited"]),
  },
  watch: {
    async tags(newValue, oldValue) {
      //console.log('this.tags : ', this.tags)
      if (this.tags.length > 0) {
        if (this.tags.filter(pl => (pl.role_id === 1))) {
          this.setSelectedPlaceFrom(this.tags.filter(pl => (pl.role_id === 1)));
        }
        if (this.tags.filter(pl => (pl.role_id === 2))) {
          //console.log('this.tags.filter(pl => (pl.role_id === 2' , this.tags.filter(pl => (pl.role_id === 2)))
          this.setSelectedPlaceTo(this.tags.filter(pl => (pl.role_id === 2)));
        }
        if (this.tags.filter(pl => (pl.role_id === 3))) {
          this.setSelectedPlaceCited(this.tags.filter(pl => (pl.role_id === 3)));
        }
        console.log("Places Watch Tags length>0 this.performSearch")
        this.performSearch();

      } else {
        if (this.init && !newValue && !oldValue) {
          console.log("Places Watch Tags length=0 but no Selections in Persons & Places : no action")
          this.init = false;
        } else {
          console.log("Places Watch Tags length=0 this.performSearch")
          this.performSearch();
        }
      }
    },
  },
  async created() {
    //await this.fetchAll();
    this.init = true;
    this.tags = [...this.selectedPlaceFrom, ...this.selectedPlaceTo, ...this.selectedPlaceCited];
  },
  methods: {
    value,
    ...mapActions("placenames", ["fetchAll"]),
    ...mapActions("search", ["setSelectedPlaceFrom", "setSelectedPlaceTo","setSelectedPlaceCited", "performSearch"]),

    getFilteredTags(text) {
      //console.log('this.allPlaces : ', this.allPlaces)
      //console.log('Object.values(this.allPlaces) : ', Object.values(this.allPlaces))
      const placesFromFiltered = this.allPlaces[0].places.filter((option) => {
        return (
          option.label.toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
      // sorting
      placesFromFiltered.sort(function(a, b) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      });

      const placesToFiltered = this.allPlaces[1].places.filter((option) => {
        return (
          option.label.toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
      // sorting
       placesToFiltered.sort(function(a, b) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      });

      const placesCitedFiltered = this.allPlaces[2].places.filter((option) => {
        return (
          option.label.toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
      // sorting
       placesCitedFiltered.sort(function(a, b) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      });

      this.filteredTags = [
          {role_id: "Lieu d'expédition", places : placesFromFiltered},
          {role_id: "Lieu de destination", places: placesToFiltered},
          {role_id: "Lieu mentionné", places: placesCitedFiltered}
      ];
      //console.log('placesListitems : ', placesFromFiltered)
      console.log('filteredTags : ', this.filteredTags)
    },
    removeTag(tag) {
      if (tag) {
        if (tag.role_id === 1) {
          //console.log('Removing array_from : ', tag)
          this.setSelectedPlaceFrom(this.tags.filter(pl => (pl.role_id === 1 && pl.placename_id !== tag.placename_id)));
          this.tags = this.tags.filter(pl => (pl.role_id === 1 && pl.placename_id !== tag.placename_id) || (pl.role_id === 2) || (pl.role_id === 3))
        }
        if (tag.role_id === 2) {
          //console.log('Removing array_to : ', tag)
          this.setSelectedPlaceTo(this.tags.filter(pl => (pl.role_id === 2 && pl.placename_id !== tag.placename_id)));
          this.tags = this.tags.filter(pl => (pl.role_id === 1) || (pl.role_id === 2 && pl.placename_id !== tag.placename_id) || (pl.role_id === 3))
        }
        if (tag.role_id === 3) {
          //console.log('Removing array_cited : ', tag)
          this.setSelectedPlaceCited(this.tags.filter(pl => (pl.role_id === 3 && pl.placename_id !== tag.placename_id)));
          this.tags = this.tags.filter(pl => (pl.role_id === 1) || (pl.role_id === 2) || (pl.role_id === 3 && pl.placename_id !== tag.placename_id))
        }
      }
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
/*control {
  max-width: 15px;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
}*/
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

.search-section-header-places {
  padding-left: 30px;
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
</style>
