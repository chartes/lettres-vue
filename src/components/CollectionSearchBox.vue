<template>
  <div v-if="$route.name === 'search'">
    <section>
      <div class="row is-flex is-justify-content-space-between">
        <i
          class="fas fa-list-ul m-2"
          style="font-size:32px;"
        />
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
            placeholder="Henri IV"
            icon="fas fa-search"
            @typing="getFilteredTags"
          >
            <template #selected="props">
              {{ props.tags.title }}
            </template>
          </b-taginput>
        </b-field>
        <div>
          <span v-if="tags.length >0 ">filtres actifs</span>
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
          @typing="getFilteredTags"
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
      filteredTags: null,
      isSelectOnly: false,
      tags: [],

      init: false,
    };
  },
  computed: {
    ...mapState("collections", {allCollections: "collectionsById"}),
    ...mapState("search", ["selectedCollections"]),
  },
  watch: {
    tags() {
      this.setSelectedCollections(this.tags);
      this.performSearch();
    },
  },
  async created() {
    await this.fetchAll();
    this.tags = this.selectedCollections;
  },
  methods: {
    ...mapActions("collections", ["fetchAll"]),
    ...mapActions("search", ["setSelectedCollections", "performSearch"]),
    getFilteredTags(text) {
      this.filteredTags = Object.values(this.allCollections).filter((option) => {
        return (
          option.title.toString().toLowerCase().indexOf(text.toLowerCase()) >=
          0
        );
      });
    },
    removeTag(tag) {
      if (tag) {
        //console.log('Removing array_from : ', tag)
        this.setSelectedCollections(this.tags.filter(coll => (coll.id !== tag.id)));
        this.tags = this.tags.filter(coll => (coll.id !== tag.id));
        }
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
