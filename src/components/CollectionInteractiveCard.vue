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
                <router-link
                  tag="button"
                  class="button control ml-2 is-primary"
                  :to="{ name: 'collection', params: { collectionId: collection.id } }"
                  ><i class="fas fa-arrow-right"></i
                ></router-link>
              </div>
              <div class="control">
                <b-field label="Curator">
                  <select @change=updateCuratorId>
                   <option :value="collection.admin.id">{{ collection.admin.username }}</option>
                   <option v-for="option in users.filter((u) => u.isAdmin === true && u.id !== collection.admin.id)" :value="option.id" :key="option.id">
                     {{ option.username }}
                   </option>
                  </select>
                </b-field>
              </div>
            </span>
          </span>
        </div>

        <div class="collection-card__dates mb-2">
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

export default {
  name: "CollectionInteractiveCard",
  components: { TitleFieldInPlace, SaveButtonIcon },
  props: {
    collectionId: { type: Number, required: true },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      saving: "normal",
      collection: null,
      curatorId: null
    };
  },
  computed: {
    ...mapState("user", ["current_user", "users"]),

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
    this.fetchUsers()
    this.curatorId = this.collection.admin.id
  },
  methods: {
    ...mapActions("collections", ["saveCollection", "fetchOne"]),
    ...mapActions("user", ["fetchUsers"]),

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
        curatorId: this.curatorId,
      });
      await this.load();
      this.saving = "normal";
    },

    saveDescription(evt) {
      this.collection.description = evt.value;
      this.save();
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
</style>

