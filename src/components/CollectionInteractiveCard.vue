<template>
  <div v-if="collection">
    <div class="collection-card card">
      <div class="card-content">
        <div class="container">
          <div class="row is-flex is-justify-content-space-between mb-4">
            <div class="col-5">
              <span class="title">
                <router-link
                  :to="{ name: 'collection', params: { collectionId: findRoot(collectionId).id } }"
                  class="collection_title mt-3 mb-5"
                >
                  {{ findRoot(collectionId).title }}
                </router-link>
              </span>
            </div>
            <div class="col-5">
              <b-button
                class="TOC-button ml-auto is-small"
                @click="showHierarchy = !showHierarchy"
              >
                SOMMAIRE
              </b-button>
              <b-sidebar
                v-model="showHierarchy"
                position="fixed"
                :right="true"
                :fullheight="true"
                class="m-3"
                style="width: 500px"
              >
                <div class="m-3">
                  <p class="menu-label">
                    SOMMAIRE
                  </p>
                  <collection-hierarchy
                    :collection-id="collectionId"
                  />
                </div>
              </b-sidebar>
            </div>
          </div>
          <div
            class="row is-flex"
            style="vertical-align: center"
          >
            <div class="column is-one-quarter">
              <img
                id="card_image"
                class="card-img-left is-rounded"
                :src="getImgUrl(collectionId)"
                alt="Card image cap"
              >
            </div>
            <div class="column is-three-quarters">
              <span
                v-if="!editMode || collection.title === 'Non triées'"
                class="collection_title"
              >
                <router-link
                  :to="{ name: 'collection', params: { collectionId: collection.id } }"
                  class="mt-3 mb-5 collection_title"
                >
                  {{ collection.title }}
                </router-link>
              </span>
              <span v-else>
                <div class="field has-addons">
                  <div class="control">
                    <input
                      v-model="collection.title"
                      class="input collection-card__title-input"
                      :class="{'input--error':!collection.title}"
                      type="text"
                      :initial-value="collection.title"
                      required
                    >
                  </div>
                  <div class="control">
                    <a
                      type="submit"
                      :disabled="!collection.title"
                      class="button is-primary"
                      :class="saving === 'loading' ? 'is-loading' : ''"
                      @click.stop="save"
                    >
                      <save-button-icon />
                    </a>
                  </div>
                  <div>
                    <collection-deletion
                      v-if="current_user && current_user.isAdmin"
                      :collection-id="collectionId"
                    />
                  </div>
                </div>
              </span>
              <!--<p class="mt-3">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor dolo incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis dolore.
              </p>-->
              <p
                v-if="!editMode || collection.title === 'Non triées'"
                class="mt-3"
              >
                <span
                  v-html="collection.description"
                />
                <span>({{ collection.documentCount }} documents)</span>
              </p>
              <p
                v-else
                class="mt-3"
              >
                <title-field-in-place
                  :tabulation-index="0"
                  label="Titre"
                  name="title"
                  not-set="Non renseigné"
                  :initial-value="collection.description"
                  :editable="true"
                  :formats="descriptionFormats"
                  @changed="saveDescription"
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer class="card-footer is-flex is-justify-content-end">
        <div class="column collection-card__dates">
          <u>Dates :</u> {{ collection.dateMin || "..." }} -
          {{ collection.dateMax || "..." }}
        </div>
        <div class="column" />
        <div
          v-if="!editMode || collection.title === 'Non triées'"
        >
          <div class="column is-inline-block">
            <p class="pt-2 pr-2 pb-2 pl-3">
              Collection curated by
            </p>
          </div>
          <div class="column is-inline-block">
            <p class="pt-2 pr-2 pb-2 pl-3">
              <a>{{ collection.admin.username }}</a>
            </p>
          </div>
        </div>
        <div
          v-else
          class="control"
        >
          <div class="column is-inline-block">
            <p class="pt-2 pr-2 pb-2 pl-3">
              Collection curated by
            </p>
          </div>
          <div class="column is-inline-block">
            <b-field>
              <select @change="updateCuratorId">
                <option :value="collection.admin.id">
                  {{ collection.admin.username }}
                </option>
                <option
                  v-for="option in users.filter((u) => u.isAdmin === true && u.id !== collection.admin.id)"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.username }}
                </option>
              </select>
            </b-field>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions, mapGetters} from "vuex";
import CollectionHierarchy from "@/components/CollectionHierarchy.vue";
import TitleFieldInPlace from "@/components/forms/fields/TitleFieldInPlace";
import SaveButtonIcon from "@/components/ui/SaveButtonIcon";
import CollectionDeletion from "@/components/CollectionDeletion.vue";

export default {
  name: "CollectionInteractiveCard",
  components: { TitleFieldInPlace, SaveButtonIcon, CollectionHierarchy, CollectionDeletion },

  props: {
    collectionId: { type: Number, required: true },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      saving: "normal",
      deleting: "normal",
      collection: null,
      showHierarchy: false,
      curatorId: null,
      error: {},
    };
  },
  computed: {
    collectionHierarchy() {
      return CollectionHierarchy
    },
    ...mapState("collections", ["collectionsById"]),
    ...mapState("user", ["current_user", "users"]),
    ...mapGetters("collections", ["findRoot"]),

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
    if (this.current_user) {
      this.fetchUsers()
    }
    this.curatorId = this.collection.admin.id
  },
  methods: {
    ...mapActions("collections", ["saveCollection", "fetchOne", "deleteCollection"]),
    ...mapActions("user", ["fetchUsers"]),

    descriptionFormats() {
      return [["superscript"]];
    },

    async load() {
      this.collection = this.$store.state.collections.collectionsById[this.$props.collectionId]
    },
    async save() {
      if (this.collection.title.length < 1) {
        this.error = {"title": "titre obligatoire"};
        this.loading = false;
        console.log('error title')
        return;
      }
      this.saving = "loading";
      await this.saveCollection({
        id: this.collection.id,
        title: this.collection.title,
        description: this.collection.description,
        curatorId: this.curatorId,
      });
      await this.load();
      this.saving = "normal";
    },
    async deleteCollectionUI() {
      this.deleting = "loading";
      const resp = await this.deleteCollection({
        id: this.collection.id,
      });
      if (resp.error) {
        this.deleting = "error";
        console.warn("failed to delete collection", this.collection.id, resp.error);
      }
      else {
        this.deleting = "normal";
        this.$router.push({ name: "collections" });
      }
    },

    saveDescription(evt) {
      this.collection.description = evt.value;
      this.save();
    },
    getImgUrl: function (img) {
      try {
        return require('@/assets/images/collections/collection' + img + '.jpg')
      } catch (e) {
        try {
          return require('@/assets/images/collections/collection' + this.findRoot(img).id + '.jpg')
        } catch (e) {
          return require('@/assets/images/collections/default.jpg')
        }
      }
    },
    updateCuratorId(evt) {
      this.curatorId = evt.target.value;
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/objects/collection.scss";
.collection-card {
  .card-img-left {
    max-height: 200px;
    border-radius: 5px;
  }
  .TOC-button {
  color: #b9192f;
  border-color: #b9192f;
  border-radius: 10px;
  }
  .collection_title {
    color: #b9192f !important;
    font-weight: normal;
  }
  .input--error{
    border-color: red;
  }
}

</style>

