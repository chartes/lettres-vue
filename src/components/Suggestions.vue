<template>
  <div>
    <section>
      <div>
        <span class="row is-flex is-justify-content-space-between suggestions-section-header">
          SUGGESTIONS
        </span>
        <div class="row is-flex is-justify-content-space-between suggestions-section-header-persons">
          <span class="advanced_search_header m-2">CORRESPONDANTS FRÉQUENTS</span>
        </div>
      </div>
      <div class="row is-flex-direction-column my-5">
        <div
          class="row is-flex is-justify-content-space-between suggestions-section-persons"
          v-for="person in sortSuggestions()"
          :key="person.label + person.role_id"
        >
          <div
            @click="searchSuggestion(person)"
          >
            <span id="tag_flag">
              {{ person.role_id === 1 ? "EXP" : person.role_id === 2 ? "DEST" : "CIT" }}
            </span>
            <span>
              {{ person.label }}
            </span>
          </div>
          <span>
            {{ person.count }}
          </span>
        </div>
        <button @click="function() {showMore = !showMore; sortSuggestions()}">{{ showMore ? "Show less" : "Show more" }}</button>
      </div>
        <!--<div>
          <span v-if="tags.length >0 ">filtres actifs</span>
          <div
            v-for="tag in tags.filter(pl => (pl.role_id === 1))"
            :key="tag.label"
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
      </div>-->
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
      showMore: false,
    };
  },
  computed: {
    ...mapState("persons", {allPersons: "persons_roles"}),
    ...mapState("search", ["selectedPersonFrom","selectedPersonTo","selectedPersonCited", "selectedPlaceFrom", "selectedPlaceTo","selectedPlaceCited"]),
  },
  /*watch: {
    async tags(newValue, oldValue) {
      console.log('this.tags : ', newValue, oldValue)
      if (this.tags.length > 0) {
        if (this.tags.filter(pers => (pers.role_id === 1))) {
          this.setSelectedPersonFrom(this.tags.filter(pers => (pers.role_id === 1)));
        }
        if (this.tags.filter(pers => (pers.role_id === 2))) {
          //console.log('this.tags.filter(pers => (pers.role_id === 2' , this.tags.filter(pers => (pers.role_id === 2)))
          this.setSelectedPersonTo(this.tags.filter(pers => (pers.role_id === 2)));
        }
        if (this.tags.filter(pers => (pers.role_id === 3))) {
          this.setSelectedPersonCited(this.tags.filter(pers => (pers.role_id === 3)));
        }
        console.log("Persons Watch Tags length>0 this.performSearch")
        this.performSearch();

      } else {
        if (this.init && !newValue && !oldValue) {
          console.log("Persons Watch Tags length=0 but no Selections in Persons & Places : no action")
          this.init = false;
        } else {
          console.log("Persons Watch Tags length=0 this.performSearch")
          this.performSearch();
        }
      }
    },
  },*/
  created() {
    //await this.fetchAll();
    this.init = true;
    //this.tags = [...this.selectedPersonFrom, ...this.selectedPersonTo, ...this.selectedPersonCited];
    console.log("Suggestions created this.allPersons",this.allPersons)
    this.sortSuggestions()
  },
  methods: {
    value,
    //...mapActions("persons", ["fetchAll"]),
    ...mapState("search", ["currentQuery"]),
    ...mapActions("search", ["setSelectedPersonFrom", "setSelectedPersonTo","setSelectedPersonCited", "setSelectedPlaceFrom", "setSelectedPlaceTo", "setSelectedPlaceCited", "resetSearchState", "performSearch"]),
    sortSuggestions() {
      let personsSuggestions = [...new Set([...this.allPersons[0]['persons'] ,...this.allPersons[1]['persons'], ...this.allPersons[2]['persons']])];
        console.log("personsSuggestions in SUGGESTIONS compo", personsSuggestions);
      if (this.showMore) {
        return personsSuggestions.sort(
            (person_x, person_y) => (person_x.count > person_y.count) ? -1 : 1).slice(0, 20)
      } else {
        return personsSuggestions.sort(
            (person_x, person_y) => (person_x.count > person_y.count) ? -1 : 1).slice(0, 5)
      }
    },
    searchSuggestion (person) {
      console.log("searchSuggestion : ", person)
      if (person.role_id === 1) {
        this.resetSearchState();
        this.setSelectedPersonFrom([person]);
      }
      if (person.role_id === 2) {
        this.resetSearchState();
        this.setSelectedPersonTo([person]);
      }
      if (person.role_id === 3) {
        this.resetSearchState();
        this.setSelectedPersonCited([person]);
      }
      this.performSearch()
    },
    /*getFilteredTags(text) {
      console.log('this.allPersons : ', this.allPersons)
      console.log('Object.values(this.allPersons) : ', Object.values(this.allPersons))
      const personsFromFiltered = this.allPersons[0].persons.filter((option) => {
        return (
          option.label.toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
      // sorting
      personsFromFiltered.sort(function(a, b) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      });

      const personsToFiltered = this.allPersons[1].persons.filter((option) => {
        return (
          option.label.toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
      // sorting
       personsToFiltered.sort(function(a, b) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      });

      const personsCitedFiltered = this.allPersons[2].persons.filter((option) => {
        return (
          option.label.toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
      // sorting
       personsCitedFiltered.sort(function(a, b) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      });

      this.filteredTags = [
          {role_id: "Expéditeur", persons : personsFromFiltered},
          {role_id: "Destinataire", persons: personsToFiltered},
          {role_id: "Personne citée", persons: personsCitedFiltered}
      ];
      //console.log('personsFromFiltered : ', personsFromFiltered)
      console.log('filteredTags : ', this.filteredTags)
    },
    removeTag(tag) {
      if (tag) {
        if (tag.role_id === 1) {
          //console.log('Removing array_from : ', tag)
          this.setSelectedPersonFrom(this.tags.filter(pers => (pers.role_id === 1 && pers.label !== tag.label)));
          this.tags = this.tags.filter(pers => (pers.role_id === 1 && pers.label !== tag.label) || (pers.role_id === 2) || (pers.role_id === 3))
        }
        if (tag.role_id === 2) {
          //console.log('Removing array_to : ', tag)
          this.setSelectedPersonTo(this.tags.filter(pers => (pers.role_id === 2 && pers.person_id !== tag.person_id)));
          this.tags = this.tags.filter(pers => (pers.role_id === 1) || (pers.role_id === 2 && pers.person_id !== tag.person_id) || (pers.role_id === 3))
        }
        if (tag.role_id === 3) {
          //console.log('Removing array_cited : ', tag)
          this.setSelectedPersonCited(this.tags.filter(pers => (pers.role_id === 3 && pers.person_id !== tag.person_id)));
          this.tags = this.tags.filter(pers => (pers.role_id === 1) || (pers.role_id === 2) || (pers.role_id === 3 && pers.person_id !== tag.person_id))
        }
      }
    }*/
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

.search-section-header-persons {
  padding-left: 30px;
  background: url('../assets/images/icons/picto-personnes.svg') center left no-repeat;
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
.suggestions-section-header {
  font-family: $family-primary;
  font-size: 16px;
  color: #C00055;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: solid 1px #FDB3CC;
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
</style>
