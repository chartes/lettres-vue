<template>
  <div
    v-if="!isLoading"
    class="large-container"
    :class="toggleCssClass"
  >
    <div
      v-if="$props.collectionId"
      class="collection-card-parent"
    >
      <collection-interactive-card
        :collection-id="$props.collectionId"
        :editable="true"
      />
    </div>

    <section
      v-if="selectedCollection && !selectedCollection.parent && $props.collectionId"
      class="collection-section mb-5"
    >
      <!-- Historique -->
      <div
        class="heading is-uppercase"
        :class="isHistoryOpen ? 'is-closed' : ''"
      >
        <span class="heading-content">Historique</span>
        <span
          class="icon"
          :aria-expanded="isHistoryOpen"
          aria-controls="historySection"
          @click="isHistoryOpen = !isHistoryOpen"
        >
        </span>
      </div>
      <b-collapse
        :class="isHistoryOpen? '' : 'hiddendiv'"
        aria-id="historySection"
      >
        <div class="collection-section-content">
          <p>Catherine de Médicis (1519-1589) est la fille du duc d’Urbino Laurent de Médicis et sde Madeleine de La Tour d’Auvergne. Épouse du duc d’orléans, second fils de François Ier, elle devient reine de France lorsque celui accède au trône de France en 1547. Trois de ses fils se succèdent ensuite comme rois de France, François II (1559-1560), Charles IX (1560-1574) et Henri III (1574-1589). Elle assure la régence du royaume à deux reprises (décembre 1560-août 1563 et février-septembre 1574), mais son influence sur le gouvernement de la France durant plus de trois décennies est très importante, ainsi qu’en témoigne sa correspondance.</p>
          <p>Ses lettres autographes reflètent la double culture de cette femme à la double culture, italienne et française. Son intense activité d’épistolière est  toutefois avant tout documentée par les très nombreuses lettres écrites pour elle par ses secrétaires à des destinataires très variés, souverains étrangers, membres de sa famille ou de la cour, mais aussi agents royaux en France et en poste en Europe.</p>
          <p>Gouverner par correspondance fut un moteur et un instrument essentiels de l’action de cette reine, puis reine-mère qui oscilla entre une politique de conciliation entre catholiques et protestants, puis une défense ferme de la monarchie contre tous ceux (réformés ou catholiques radicaux) qui menaçaient l’unité du royaume autour du souverain incarné par ses fils.</p>
        </div>
      </b-collapse>
      <!-- Contributeurs & partenariats -->
      <div
        class="heading is-uppercase"
        :class="isCreditsOpen ? 'is-closed' : ''"
      >
        <span class="heading-content">Contributeurs & partenariats</span>
        <span
          class="icon"
          :aria-expanded="isCreditsOpen"
          aria-controls="creditsSection"
          @click="isCreditsOpen = !isCreditsOpen"
        >
        </span>
      </div>
      <b-collapse
        :class="isCreditsOpen? '' : 'hiddendiv'"
        aria-id="creditsSection"
      >
        <div class="collection-section-content">
          <p>L’édition publiée au XIXe siècle par le Comité des travaux historiques et scientifiques a été partiellement, revue, associée à des métadonnées et complétée par l’édition de de nouvelles lettres par Aurélie Massie, Olivier Poncet et Julien Wilmart.</p>
        </div>
      </b-collapse>
      <!-- Bibliographie -->
      <div
        class="heading is-uppercase"
        :class="isBiblioOpen ? 'is-closed' : ''"
      >
        <span class="heading-content">Bibliographie sélective</span>
        <span
          class="icon"
          :aria-expanded="isBiblioOpen"
          aria-controls="biblioSection"
          @click="isBiblioOpen = !isBiblioOpen"
        >
        </span>
      </div>
      <b-collapse
        :class="isBiblioOpen? '' : 'hiddendiv'"
        aria-id="biblioSection"
      >
        <div class="collection-section-content">
          <ul class="mt-2 mb-2">
            <li><em>Lettres de Catherine de Médicis</em>, éd. Hector de La Ferrière-Percy et Gustave Baguenault de Puchesse, 11 volumes, Paris, Imprimerie nationale, 1880-1943 (Documents inédits sur l’histoire de France)</li>
            <li>Matthieu Gellard, <em>Commentaire critique de l’édition des « Lettres de Catherine de Médicis »</em>, Paris, Cour de France.fr, 2013 (<a target="_blank" href="https://cour-de-france.fr/article2788.html">https://cour-de-france.fr/article2788.html</a>)</li>
            <li>Matthieu Gellard, <em>Une reine épistolaire. Lettres et pouvoir au temps de Catherine de Médicis</em>, Paris, Classiques Garnier, 2014 (Bibliothèque d’histoire de la Renaissance, 8).</li>
          </ul>
        </div>
      </b-collapse>
    </section>
    <section v-if="selectedCollection">
      <document-list
        :collection-id="selectedCollection.id"
      />
    </section>
  </div>
</template>

<script>
import CollectionInteractiveCard from "@/components/CollectionInteractiveCard.vue";
import { mapActions, mapState } from "vuex";
import DocumentList from "@/components/sections/DocumentList.vue";

export default {
  name: "CollectionPage",
  components: {
    DocumentList,
    CollectionInteractiveCard,
  },
  props: {
    "collectionId": {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      isHistoryOpen: true,
      isCreditsOpen: true,
      isBiblioOpen: true,
      selectedCollection: {},
      isLoading: false,
      showHierarchy: false,
      isActive: true
    };
  },
  computed: {
    toggleCssClass: function() {
      return this.isActive ? 'is-active' : 'is-inactive';
    },
  },
  watch: {
    collectionId: async function () {
      console.log("Watch, $props.collectionId / collectionId = ", this.$props.collectionId, this.collectionId);
      await this.setCollection();
    },
  },
  async created() {
    this.isLoading = true;
    await this.fetchAll();
    await this.setCollection();
    this.isLoading = false;
  },
  methods: {
    ...mapActions("collections", ["fetchOne", "fetchAll", "setSelectedCollection"]),
    // added document List
    ...mapActions("search", ["setSelectedCollections", "performSearch"]),
    searchCollection() {
      this.$store.state.search.selectedCollections = [this.selectedCollection];
      this.$store.state.layout.showLeftSideBar = true
    },
    toggle() {
      console.log(this.sortingPriority)
      if (this.isActive === true) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
    async setCollection() {
      console.log("this.setCollection()")
      if (this.$props.collectionId) {
        this.setSelectedCollection(this.$store.state.collections.collectionsById[this.$props.collectionId]);
        this.selectedCollection = this.$store.state.collections.selectedCollection;
      } else {
        this.selectedCollection = this.$store.state.collections.selectedCollection;
      }
      // Setting selected collection in search Store to retrieve documents
      this.searchCollection();
      // Retrieve related documents without persons / places full metadata
      this.performSearch('simple');
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/elements/_select.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

::v-deep .sidebar-content {
  width: 500px;
}


.large-container {
  position: relative;
  margin-top: 60px;

  @include on-tablet {
    margin-top: 30px;
  }
}

.collection-card-parent {
  padding-bottom: 20px;

  @include on-mobile {
    padding-bottom: 50px;
  }

}

::v-deep .card-footer {
  border: none !important;
}

progress {
  margin-top: 30px;
}

// Sections : Termes et contenus des metadonnées de la collection
.collection-section {

  & > .heading {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-bottom: 20px;

    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    color: #FF0052;
    letter-spacing: 0;
    text-transform: uppercase;

    .heading-content {
      order: 1;
      display: inline-block;
      white-space: pre;
    }

    span.icon {
      display: inline-block;
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: url(../assets/images/icons/open_text.svg) center / 24px auto no-repeat;
      order: 3;

      i {
        display: none;
      }
    }

    &.is-closed span.icon {
      background: url(../assets/images/icons/close_text.svg) center / 18px auto no-repeat;
    }

    &::after {
      order: 2;
      display: block;
      content: '';
      width: 100%;
      border-bottom: 1px solid #FF0052;
    }
  }

  & .collection-section-content {
    padding: 30px 140px 30px 90px;
    font-size: 20px;
    line-height: 26px;

    @include on-tablet {
      padding: 10px 20px;
      font-size: $font-size-text-tablet;
      line-height: 1.2;
    }

    @include on-mobile {
      padding: 0;
      font-size: $font-size-text-mobile;
      line-height: 1.25;
    }

    p {
      margin-bottom: 20px;
    }
  }
}



::v-deep .lettre span {
    background-color: red;
}
.collection-documents {
  display: flex;
  align-items: flex-end;
  gap: 4px;

  flex-grow: 1;
  margin: 5px 0;
  padding-left: 2px;
  padding-right: 2px;

  font-size: 14px;
  color: #FF0052;
  font-weight: 500;
  text-transform: uppercase;
  white-space: nowrap;

  &::after {
    content: '';
    display: inline-block;
    border-bottom: 1px solid #FF0052;
    width: 100%;
    transform: translateY(-2px);
  }

  span.documents-count {
    font-weight: 700;
  }
}

.search-collection-parent {
  border-bottom: 1px solid #D5D5D5;
  padding-bottom: 15px;
}

.search-collection {
  margin: 32px 5px 5px;
  padding: 10px;
  background-color: transparent;
  border: #C00055 solid 1px;
  border-radius: 5px;

  font-family: $family-primary;
  font-size: 14px;
  font-weight: 400;
  color: #C00055;
  text-transform: uppercase;
}

.sort-options {
  gap: 10px;
  margin-bottom: 0 !important;

  .icon.button {
    width: 25px;
    height: 25px;
    border: none !important;

    &::after {
      content: '';
      display: inline-block;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      transform-origin: 50% 50%;
      background-image: url(../assets/images/icons/tri-fleche.svg);
    }

    &.arrow-down {
      transform: rotate(180deg);
    }

    i {
      display: none;
    }
  }

  & > span {
    font-family: $family-primary;
    font-size: 16px;
    color: #C00055;
    font-weight: 600;
    text-transform: uppercase;
  }
}

.switch-button {
  background-color: lightgrey;
  border-radius: 30px;
  overflow: hidden;
  width: 240px;
  height: 35px;
  text-align: center;
  position: relative;
  padding-right: 120px;

  font-family: $family-primary;
  font-size: 14px;

  color: white;
  transition: all ease-in-out 300ms;

  &.is-active {
    color: grey;
    .switch-button-label-span {
      color: white;
    }
  }

  &.is-inactive {
    color: white;
    .switch-button-label-span {
      color: grey;
    }
  }

  &:before {
    content: "DEPLIE";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 120px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    pointer-events: none;
  }

  &-checkbox {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;

    &:checked + .switch-button-label:before {
      transform: translateX(120px);
      transition: transform 300ms linear;
    }

    & + .switch-button-label {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      pointer-events: none;
      height: 100%;

      &:before {
        content: "";
        background: rgb(255, 0, 83);
        height: 35px;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 30px;
        transform: translateX(0);
        transition: transform 300ms;
      }

      .switch-button-label-span {
        position: relative;
      }
    }
  }
}
.pagination-controls {
  display: flex;
  align-items: center;
  /*visibility: hidden;*/

  & > * {
    display: inline-block;
    width: 38px;
    height: 38px;
    margin-right: 4px;
  }
  & > a {
    display: inline-block;
    width: 38px;
    height: 38px;
    background-color: #C3C3C3;
    border-radius: 3.2px;
  }
  & > a.disabled {
    cursor: not-allowed !important;
  }
  & > a.first-page {
    background: #C3C3C3 url(../assets/images/icons/page_debut.svg)  center / 28px auto no-repeat;
  }
  & > a.previous-page {
    background: #C3C3C3 url(../assets/images/icons/page_precedent.svg) center / 28px auto no-repeat;
  }
  & > a.next-page {
    background: #C3C3C3 url(../assets/images/icons/page_suivant.svg) center / 28px auto no-repeat;
  }
  & > a.last-page {
    background: #C3C3C3 url(../assets/images/icons/page_fin.svg) center / 28px auto no-repeat;
  }
  /*
  & > input[type=number],
  & > input[type=text] {
   */

  & > input {
    height: 38px !important;
    padding: 0 !important;
    border: 1px solid #C00055;
    border-radius: 3.2px;

    font-family: $family-primary;
    font-size: 18px;
    color: #CB2158;
    font-weight: 800;
    text-align: center;
    text-decoration: none;

    &:focus {
      outline: 1px solid #C00055;
    }
  }

  & > span.label-sur-page {
    font-family: $family-primary;
    font-size: 11px;
    line-height: 38px;
    color: #979797;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
  }

  & > span.total-pages {
    background-color: #DFDFDF;
    border-radius: 3.2px;

    font-family: $family-primary;
    font-size: 18px;
    line-height: 38px;
    color: #818181;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
  }
}
.hiddendiv {
  display: none;
}

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>
