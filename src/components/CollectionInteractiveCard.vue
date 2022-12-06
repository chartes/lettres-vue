<template>
  <div v-if="collection">
    <div class="collection-card card">
      <div class="card-content">
        <div class="is-flex is-justify-content-space-between mb-4">
          <span class="title is-flex is-justify-content-space-between">
            <span v-if="!editMode">
              <router-link
                :to="{ name: 'collection', params: { collectionId: collection.id } }"
                class="mt-3 mb-5"
              >
                {{ collection.title }}
              </router-link>
            </span>
            <span v-else>
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input collection-card__title-input"
                    type="text"
                    placeholder="Titre de la collection"
                    v-model="collection.title"
                  />
                </div>
                <div class="control">
                  <a
                    @click.stop="save"
                    class="button is-primary"
                    :class="saving === 'loading' ? 'is-loading' : ''"
                  >
                    <save-button-icon />
                  </a>
                </div>
                <div class="control">
                  <a
                    @click.stop="deleteCollectionUI"
                    class="button is-primary"
                    :class="deleting === 'loading' ? 'is-loading' : ''"
                  >
                    <delete-button-icon />
                  </a>
                </div>
              </div>
            </span>
          </span>
        </div>

        <div class="collection-card__dates mb-2">
          <u>Dates :</u> {{ collection.dateMin || "..." }} -
          {{ collection.dateMax || "..." }}
        </div>

        <div class="columns">
          <div class="column">
            <p v-if="!editMode">
              <span v-html="collection.description"></span> ({{
                collection.documentCount
              }}
              documents)
            </p>
            <p v-else>
              <title-field-in-place
                :tabulation-index="0"
                label="Titre"
                name="title"
                not-set="Non renseigné"
                :initial-value="collection.description"
                :editable="true"
                @changed="saveDescription"
                :formats="descriptionFormats"
              />
            </p>

            <div class="collection-card__children mt-2 mb-2 pl-3 ml-3">
              <ul>
                <li v-for="child in collection.children" :key="child.id">
                  <router-link
                    :to="{ name: 'collection', params: { collectionId: child.id } }"
                    class="mt-5 mb-5"
                    >{{ child.title }} ({{ child.nb_docs }} documents)</router-link
                  >
                </li>
              </ul>
            </div>
          </div>
          <div v-if="collection.parents && collection.parents.length > 0" class="column">
            <span>Collections parentes :</span>
            <ul class="collection-card__children mt-2 mb-2 pl-3 ml-3">
              <li v-for="parent in collection.parents" :key="parent.id">
                <router-link
                  :to="{ name: 'collection', params: { collectionId: parent.id } }"
                  class="mt-5 mb-5"
                  >{{ parent.title }}</router-link
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer class="card-footer is-flex is-justify-content-end">
        <p class="pt-2 pr-2 pb-2 pl-3">
          Collection curated by <a>{{ collection.admin.username }}</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TitleFieldInPlace from "@/components/forms/fields/TitleFieldInPlace";
import SaveButtonIcon from "@/components/ui/SaveButtonIcon";
import DeleteButtonIcon from "@/components/ui/DeleteButtonIcon";

export default {
  name: "CollectionInteractiveCard",
  components: { TitleFieldInPlace, SaveButtonIcon, DeleteButtonIcon },
  props: {
    collectionId: { type: String, required: true },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      saving: "normal",
      deleting: "normal",
      collection: null,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),

    editMode() {
      return (
        this.editable &&
        this.collection &&
        this.current_user &&
        this.current_user.isAdmin
      );
    },
  },
  watch: {
    "collection.title"() {
      this.saving = "normal";
    },
    collectionId: async function () {
      await this.load();
    },
  },
  async created() {
    await this.load();
  },
  methods: {
    ...mapActions("collections", ["saveCollection", "fetchOne", "deleteCollection"]),

    descriptionFormats() {
      return [["superscript"]];
    },

    async load() {
      const data = await this.fetchOne({
        id: this.$props.collectionId,
        numPage: null,
      });
      this.collection = data.collection;
    },
    async save() {
      this.saving = "loading";
      await this.saveCollection({
        id: this.collection.id,
        title: this.collection.title,
        description: this.collection.description,
      });
      await this.load();
      this.saving = "normal";
    },
    async deleteCollectionUI() {
      this.deleting = "loading";
      await this.deleteCollection({
        id: this.collection.id,
      });
      this.deleting = "normal";
      this.$router.push({ name: "collections" });
    },

    saveDescription(evt) {
      this.collection.description = evt.value;
      this.save();
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/objects/collection.scss";
</style>

