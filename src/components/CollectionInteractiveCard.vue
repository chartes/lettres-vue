<template>
  <div v-if="collection">
    <div class="collection-interactive-card">
      <div class="collection-card-header row is-flex">
        <div class="parent-collection-title">
          <!--<span v-if="!editMode">-->
          <router-link
            :to="{ name: 'collection', params: { collectionId: findRoot(collectionId).id } }"
          >
            <!--{{ collection.title }}-->
            {{ findRoot(collectionId).title }}
          </router-link>
        </div>

        <!--</span>
        <span v-else>
          <div class="field has-addons">
            <div class="control">
              <input
                v-model="collection.title"
                class="input collection-card__title-input"
                type="text"
                placeholder="Titre de la collection"
              >
            </div>
            <div class="control">
              <a
                class="button is-primary"
                :class="saving === 'loading' ? 'is-loading' : ''"
                @click.stop="save"
              >
                <save-button-icon />
              </a>
            </div>
            <router-link
              tag="button"
              class="button control ml-2 is-primary"
              :to="{ name: 'collection', params: { collectionId: collection.id } }"
            ><i class="fas fa-arrow-right" /></router-link>
=======
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
<<<<<<< HEAD
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
=======
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
>>>>>>> upstream/dev
                />
              </div>
            </b-sidebar>
>>>>>>> upstream/dev
          </div>
        </span>-->

        <div class="collection-actions central-column is-flex">
          <!-- Nouvelle sous-collection -->
          <router-link
            v-if="current_user && current_user.isAdmin"
            v-slot="{ navigate }"
            to="create"
            custom
            append
          >
            <b-button
              type="is-primary"
              label="Créer une sous-collection"
              class="create-collection-btn"
              @click="navigate"
            />
          </router-link>
          <!-- Supprimer la collection -->
          <collection-deletion
            v-if="current_user && current_user.isAdmin"
            :collection-id="collectionId"
          />
        </div>
      </div>

      <div
        class="collection-card-body row is-flex"
        style="vertical-align: center"
      >
        <!-- Colonne 1 : vignette -->
        <div class="column thumbnail-column">
          <div class="collection-thumbnail">
            <img
              id="card_image"
              :src="getImgUrl(collectionId)"
              alt="Card image cap"
            >
          </div>
          <div class="collection-thumbnail-caption">
            Légende éventuelle
          </div>
        </div>

        <!-- Colonne 2 : metadonnées de la collections -->
        <div class="column central-column metadata-column">
          <!-- Titre de la collection -->
          <span
            v-if="!editMode || collection.title === 'Non triées'"
          >
            <router-link
              :to="{ name: 'collection', params: { collectionId: collection.id } }"
              class="collection-title"
            >
              {{ collection.title }}
            </router-link>
          </span>
          <div v-else>
            <div class="field has-addons">
              <input
                v-model="collection.title"
                class="input collection-card__title-input"
                :class="{'input--error':!collection.title}"
                type="text"
                :initial-value="collection.title"
                required
              >
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
            </div>
          </div>

          <!-- Date de la collection -->
          <div class="collection-dates">
            <span>{{ collection.dateMin || "..." }}</span>
            <span>{{ collection.dateMax || "..." }}</span>
          </div>

          <!-- Description de la collection -->
          <div class="collection-description">
            <p v-if="!editMode || collection.title === 'Non triées'">
              <span v-html="collection.description" />
            </p>
            <p v-else>
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

          <!-- Curateur de la collection -->
          <div
            v-if="!editMode || collection.title === 'Non triées'"
            class="collection-user-roles"
          >
            <p>
              Curateur :
            </p>
            <div class="collection-user-roles-value">
              <a>{{ collection.admin.username }}</a>
            </div>
          </div>
          <div
            v-else
            class="collection-user-roles control"
          >
            <p>
              Curateur :
            </p>
            <div class="is-inline-block">
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
        </div>

        <!-- not in Carine code {{ error.title }}
        <router-link
          tag="button"
          class="button control ml-2 is-primary"
          :to="{ name: 'collection', params: { collectionId: collection.id } }"
        ><i class="fas fa-arrow-right" /></router-link>
      </div>-->
        <!--<div class="control">
          <b-field label="Curator">
            <select @change="updateCuratorId">
              <option :value="collection.admin.id">{{ collection.admin.username }}</option>
              <option
                v-for="option in users.filter((u) => u.isAdmin === true && u.id !== collection.admin.id)"
                :key="option.id"
                :value="option.id"
              >
                {{ option.username }}
              </option>
            </select>
          </b-field>
        </div>-->

        <!-- Colonne 3 : Sommaire -->
        <div class="column toc-column">
          <b-button
            class="TOC-button"
            :class="showHierarchy ? 'opened' : ''"
            @click="showHierarchy = !showHierarchy"
          >
            SOMMAIRE
          </b-button>
          <div v-if="showHierarchy">
            <collection-hierarchy
              :collection-id="collectionId"
              class="TOC-content"
            />
          </div>
        </div>
      </div>

      <!--Carine code <div class="control">
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
          <delete-button-icon :status="deleting === 'error' ? 'error' : deleting === 'normal' ? 'normal' : ''" />
        </a>
      </div>
    </div>
  </span>
  </span>-->
      <!--<div class="columns is-vcentered">
        <img
          id="card_image"
          class="card-img-left m-6 is-inline-block is-rounded"
          :src="getImgUrl(collectionId)"
          alt="Card image cap"
        >
        <div class="column">
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
                        v-model="collection.title"
                        class="input collection-card__title-input"
                        type="text"
                        placeholder="Titre de la collection"
                      >
                    </div>
                    <div class="control">
                      <a
                        class="button is-primary"
                        :class="saving === 'loading' ? 'is-loading' : ''"
                        @click.stop="save"
                      >
                        <save-button-icon />
                      </a>
                    </div>
                    <router-link
                      tag="button"
                      class="button control ml-2 is-primary"
                      :to="{ name: 'collection', params: { collectionId: collection.id } }"
                    ><i class="fas fa-arrow-right" /></router-link>
                  </div>
                  <div class="control">
                    <b-field label="Curator">
                      <select @change="updateCuratorId">
                        <option :value="collection.admin.id">{{ collection.admin.username }}</option>
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
                </span>
              </span>
            </div>

            <div class="collection-dates">
              <u>Dates :</u> {{ collection.dateMin || "..." }} -
              {{ collection.dateMax || "..." }}
            </div>

            <p v-if="!editMode">
              <span v-html="collection.description" /> ({{
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
                :formats="descriptionFormats"
                @changed="saveDescription"
              />
            </p>
          </div>
        </div>
      </div>-->

      <footer class="card-footer is-flex is-justify-content-end" />
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
@import "@/assets/sass/components/_buttons.scss";

.collection-interactive-card {
  background: none !important;
  border: none !important;

  .collection-card-header {
    gap: 55px;
    align-items: flex-end;
    margin-bottom: 22px;

    .parent-collection-title {
      flex: $collection-thumbnail-size 0 0;
      font-family: $family-primary;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;

      @include on-small-desktop {
        flex: $collection-thumbnail-small-desktop-size 0 0;
      }

      @include on-tablet {
        flex: $collection-thumbnail-tablet-size 0 0;
      }

      & > a {
        color: #C00055;
      }
    }

    .collection-actions {
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  .central-column {
    width: calc( 100% - $collection-thumbnail-size - 290px - 2 * 55px );

    @include on-small-desktop {
      width: calc( 100% - $collection-thumbnail-small-desktop-size - 290px - 2 * 55px );
    }

    @include on-tablet {
      width: calc( 100% - $collection-thumbnail-tablet-size - 290px - 2 * 55px );
    }
  }

  .collection-card-body {
    gap: 55px;

    .column {
      padding: 0;
    }

    .thumbnail-column {
      flex: $collection-thumbnail-size 0 0;
      margin-top: 7px;

      @include on-small-desktop {
        flex: $collection-thumbnail-small-desktop-size 0 0;
      }

      @include on-tablet {
        flex: $collection-thumbnail-tablet-size 0 0;
      }
    }

    .metadata-column {
      width: calc( 100% - $collection-thumbnail-size - 290px - 2 * 55px );
      border-top: #C00055 solid 7px;
      padding-top: 15px;

      .field.has-addons {
        display: flex;

        .control {
          width: 48px;
        }
      }
    }

    .toc-column {
      flex: 290px 0 0;
      border-top: #C00055 solid 7px;
    }
  }


  .collection-title {
    font-family: $family-primary;
    font-size: 35px;
    font-weight: 500;
    color: #000000;
  }

  .collection-thumbnail {
    width: $collection-thumbnail-size;
    height: $collection-thumbnail-size;
    padding: 0;
    margin-bottom: 15px;
    overflow: hidden;
    border-radius: 20px;

    @include on-small-desktop {
      width: $collection-thumbnail-small-desktop-size;
      height: $collection-thumbnail-small-desktop-size;
    }

    @include on-tablet {
      width: $collection-thumbnail-tablet-size;
      height: $collection-thumbnail-tablet-size;
    }

    img {
      width: 100%;
      height: 100%;
      max-height: unset;
      object-fit: cover;
      object-position: center;
      border-radius: 0;
    }
  }

  .collection-thumbnail-caption {
    margin-bottom: 30px;
    font-family: $family-secondary;
    font-size: 16px;
    color: #000000;
    font-weight: 400;
    line-height: 21px;
  }

  .collection-dates {
    margin-bottom: 14px;
    font-family: $family-primary;
    font-size: 16px;
    font-weight: 500;
    color: #6D7278;
    text-transform: uppercase;

    & > span:first-child::after {
      content: ">";
      margin: 0 8px;
    }
  }

  .collection-description {
    margin-bottom: 30px;
    font-family: $family-primary;
    font-size: 18px;
    color: #000000;
    font-weight: 400;
    line-height: 24px;
  }

  .collection-user-roles {
    margin-bottom: 30px;

    /* label */
    & > p {
      font-family: $family-primary;
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      text-transform: uppercase;
    }

    /* value : read mode */
    .collection-user-roles-value a {
      font-family: $family-primary;
      font-size: 18px;
      font-weight: 400;
      color: #4A4A4A;
    }
  }

  .TOC-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 12px 10px 14px 2px;
    border:none;
    border-radius: 0;
    border-bottom: solid 1px #C00055;
    box-shadow: none !important;

    font-family: $family-primary;
    font-size: 16px;
    font-weight: 500;
    color: #6D7278;
    text-align: left;

    :focus {
      border: none;
      box-shadow: none !important;
    }

    &::after {
      content: "";
      display: inline-block;
      width: 14px;
      height: 10px;
      background: url(../assets/images/icons/open_menu_coll.svg) center right / 14px auto no-repeat;
    }

    &.opened::after {
      transform-origin: 50% 50%;
      transform: rotate(180deg);
    }
  }

  .TOC-content {
    background-color: #F8F8F8;
    padding-bottom: 20px;
    border-bottom: 1px solid #C00055;
    margin-bottom: 30px;

    ::v-deep li  a {
      padding: 0 10px;
    }
  }

  .input--error{
    border-color: red;
  }
}

</style>

