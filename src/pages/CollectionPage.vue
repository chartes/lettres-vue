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
      v-if="selectedCollection && !selectedCollection.parent && $props.collectionId && selectedCollection.title !== 'Hors collections'"
      class="collection-section mb-5"
    >
      <collection-presentation
        :collection-id="$props.collectionId"
        class="collection-section mb-5"
      />
      <!-- Historique -->
    </section>
    <section v-if="selectedCollection">
      <document-list
        content-type="collection-results"
        :collection-id="selectedCollection.id"
      />
    </section>
  </div>
</template>

<script>
import CollectionInteractiveCard from "@/components/CollectionInteractiveCard.vue";
import { mapActions, mapState } from "vuex";
import DocumentList from "@/components/sections/DocumentList.vue";
import CollectionPresentation from "@/pages/CollectionPresentations.vue";

export default {
  name: "CollectionPage",
  components: {
    CollectionPresentation,
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

    @include on-mobile {
      margin-bottom: 10px;
      font-size: 13px;
    }

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
      line-height: 1.25;
    }

    @include on-mobile {
      padding: 0;
      font-size: $font-size-text-mobile;
      line-height: 1.28;
    }

    p {
      margin-bottom: 20px;
    }

    ul li {
      margin-bottom: 8px !important;
    }

    a{
      color: #C00055;

      &:hover {
        text-decoration: underline;
        text-decoration-style: dotted;
        text-underline-offset: 2px;
      }
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

  @include on-mobile {
    width: 160px;
  }

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

    @include on-mobile {
      width: 80px;
    }
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

      @include on-mobile {
        transform: translateX(80px);
      }
    }

    & + .switch-button-label {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      pointer-events: none;
      height: 100%;

      @include on-mobile {
        width: 90px;
      }

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
