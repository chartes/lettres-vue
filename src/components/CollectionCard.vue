<template>
  <div v-if="collection">
    <div class="collection-card card">
      <div class="columns is-vcentered">
        <div class="column is-2 has-text-centered">
          <img
            id="card_image"
            class="card-img-left m-2 is-inline-block"
            :src="require('../assets/images/collections/collection'+collectionId+'.jpg')"
            alt="Card image cap"
          >
        </div>
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

                <div class="collection-card__children mt-2 mb-2 pl-3 ml-3">
                  <ul>
                    <li
                      v-for="child in collection.children"
                      :key="child.id"
                    >
                      <router-link
                        :to="{ name: 'collection', params: { collectionId: child.id } }"
                        class="mt-5 mb-5"
                      >
                        {{ child.title }} ({{ child.nb_docs }} documents)
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="collection.parents && collection.parents.length > 0"
                class="column"
              >
                <span>Collections parentes :</span>
                <ul class="collection-card__children mt-2 mb-2 pl-3 ml-3">
                  <li
                    v-for="parent in collection.parents"
                    :key="parent.id"
                  >
                    <router-link
                      :to="{ name: 'collection', params: { collectionId: parent.id } }"
                      class="mt-5 mb-5"
                    >
                      {{ parent.title }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content">
        <h2 class="subtitle">
          Historique
        </h2>
        <p class="has-text-justified mb-2">
          Catherine de Médicis (1519-1589) est la fille du duc d’Urbino Laurent de Médicis et sde Madeleine de La Tour d’Auvergne. Épouse du duc d’orléans, second fils de François Ier, elle devient reine de France lorsque celui accède au trône de France en 1547. Trois de ses fils se succèdent ensuite comme rois de France, François II (1559-1560), Charles IX (1560-1574) et Henri III (1574-1589).
        </p>
        <p class="has-text-justified mb-2">
          Elle assure la régence du royaume à deux reprises (décembre 1560-août 1563 et février-septembre 1574), mais son influence sur le gouvernement de la France durant plus de trois décennies est très importante, ainsi qu’en témoigne sa correspondance.
        </p>
        <p class="has-text-justified mb-2">
          Ses lettres autographes reflètent la double culture de cette femme à la double culture, italienne et française. Son intense activité d’épistolière est  toutefois avant tout documentée par les très nombreuses lettres écrites pour elle par ses secrétaires à des destinataires très variés, souverains étrangers, membres de sa famille ou de la cour, mais aussi agents royaux en France et en poste en Europe.
        </p>
        <p class="has-text-justified mb-2">
          Gouverner par correspondance fut un moteur et un instrument essentiels de l’action de cette reine, puis reine-mère qui oscilla entre une politique de conciliation entre catholiques et protestants, puis une défense ferme de la monarchie contre tous ceux (réformés ou catholiques radicaux) qui menaçaient l’unité du royaume autour du souverain incarné par ses fils.
        </p>
        <h2 class="subtitle">
          Contributeurs
        </h2>
        <p class="has-text-justified mb-2">
          L’édition publiée au XIXe siècle par le Comité des travaux historiques et scientifiques a été partiellement, revue, associée à des métadonnées et complétée par l’édition de de nouvelles lettres par Aurélie Massie, Olivier Poncet et Julien Wilmart.
        </p>
        <h2 class="subtitle">
          Bibliographie sélective :
        </h2>
        <ul class="mt-2 mb-2">
          <li><em>Lettres de Catherine de Médicis</em>, éd. Hector de La Ferrière-Percy et Gustave Baguenault de Puchesse, 11 volumes, Paris, Imprimerie nationale, 1880-1943 (Documents inédits sur l’histoire de France)</li>
          <li>Matthieu Gellard, <em>Commentaire critique de l’édition des « Lettres de Catherine de Médicis »</em>, Paris, Cour de France.fr, 2013 (<a target="_blank" href="https://cour-de-france.fr/article2788.html">https://cour-de-france.fr/article2788.html</a>)</li>
          <li>Matthieu Gellard, <em>Une reine épistolaire. Lettres et pouvoir au temps de Catherine de Médicis</em>, Paris, Classiques Garnier, 2014 (Bibliothèque d’histoire de la Renaissance, 8).</li>
        </ul>
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
  name: "CollectionCard",
  components: { TitleFieldInPlace, SaveButtonIcon },
  props: {
    collectionId: { type: String, required: true },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      saving: "normal",
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
        this.current_user.id === this.collection.admin.id
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
    ...mapActions("collections", ["saveCollection", "fetchOne"]),

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
