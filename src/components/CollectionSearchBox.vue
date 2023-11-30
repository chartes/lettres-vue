<template>
  <div v-if="$route.name === 'search'">
    <section>
      <div class="row is-flex is-justify-content-space-between search-section-header-collections">
        <span class="advanced_search_header m-2">COLLECTIONS</span>
        <router-link
          :to="{ name: 'collections' }"
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
            field="title"
            :placeholder="collectionsTags && collectionsTags.length > 0 ? 'Henri IV' : 'Elargir les critères'"
            icon="fas fa-search"
            @typing="updateFilteredTags"
          >
            <template #selected="props">
              {{ props.tags.title }}
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
            v-for="tag in tags"
            :key="tag.id"
            style="cursor: pointer"
            class="is-flex mb-1"
          >
            <b-tag
              id="tag_label"
              :title="tag.title"
              :class="{selected: tag.isSelected === true}"
              closable
              @click.native="removeTag(tag)"
            >
              {{ tag.title }}
            </b-tag>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else>
    <section>
      <b-field label="Collections">
        <b-taginput
          v-model="tags"
          :data="filteredTags"
          autocomplete
          :open-on-focus="true"
          field="title"
          placeholder="Henri IV"
          @typing="updateFilteredTags"
        />
      </b-field>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      filteredTags: [],
    };
  },
  computed: {
    ...mapState("collections", {allCollections: "collectionsById", collectionsTags: "collectionsTags"}),
    ...mapState("search", ["selectedCollections"]),
    allData: {
      get: function () {
        if (this.$route.name === "search") {
          return Object.values(this.collectionsTags);
        } else {
          return Object.values(this.allCollections);
        }
      }
    },
    tags: {
      get: function () {
        return this.selectedCollections
      },
      set: function (value) {
        this.setSelectedCollections(value)
        this.performSearch();
        return value
      }
    }
  },
  methods: {
    ...mapActions("search", ["setSelectedCollections", "performSearch"]),
    updateFilteredTags(text) {
      this.filteredTags = this.allData.filter(
        (option) => option.title.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
      );
    },
    removeTag(tag) {
      if (tag) {
        this.tags = this.tags.filter(coll => (coll.id !== tag.id));
      }
    },
    removeAllTags() {
      this.tags = [];
    }
  },
};
</script>

<style lang="scss">

@import "@/assets/sass/main.scss";

#tag_label {
  background-color: white;
  color: black;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.search-section-header-collections {
  padding-left: 30px;
  background: url('../assets/images/icons/picto-collections.svg') center left no-repeat;
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
