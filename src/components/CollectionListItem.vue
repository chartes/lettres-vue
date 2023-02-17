<template>
  <div class="collection-card card">
    <div
      class="card-header is-flex is-align-items-center"
      :class="expandedById[collection.id] ? 'expanded': ''"
    >
      <div class="collection-thumbnail">
        <img
          id="card_image"
          class="card-img-left is-inline-block"
          :src="getImgUrl(collectionId)"
          alt="Card image cap"
        >
      </div>
      <router-link
        :to="{ name: 'collection', params: { collectionId: collection.id } }"
        class="collection-title"
      >
        {{ collection.title }}
      </router-link>
      <div class="collection-infos is-flex is-flex-direction-column">
        <div class="collection-dates is-flex">
          <span>{{ collection.dateMin || "..." }}</span>
          <span>{{ collection.dateMax || "..." }}</span>
        </div>
        <div>
          <span class="documents-count">{{ collection.documentCount }}</span>
          <span class="documents-count-label"> documents</span>
        </div>
      </div>
    </div>
    <div class="card-body card-content">
      <div
        class="collection-description"
        v-html="collection.description"
      />
      <div class="collection-metadata is-flex">
        <p>
          <label>Curateur :</label>&nbsp;<a>{{ collection.admin.username }}</a>
        </p>
      </div>
    </div>
    <!-- Collection children -->
    <footer
      v-if="collection.children.length > 0"
      class="card-footer collect-card__children is-flex is-flex-direction-column"
      :class="expandedById[collection.id] ? 'expanded': ''"
    >
      <button
        class="show-children"
        @click="toggleExpanded(collection.id)"
      >
        Parcourir la collection
      </button>
      <div v-if="expandedById[collection.id]">
        <div
          v-for="childCollection of flattenedCollectionsTree(collection.children, parentExpanded)"
          :key="childCollection.id"
          :style="`margin-left: ${ 23 * childCollection.depth + (childCollection.children.length > 0 ? 0 : 23)}px;`"
          class="child-collection"
          :class="expandedById[childCollection.id] ? 'expanded': ''"
        >
          <button
            v-if="childCollection.children.length > 0"
            class="expand-collection"
            @click="toggleExpanded(childCollection.id)"
          >
          </button>
          <router-link :to="{name: 'collection', params: {collectionId: childCollection.id}}">
            {{ childCollection.title }}&nbsp;-&nbsp; {{ childCollection.documentCount }} document{{ childCollection.documentCount > 1 ? "s" : "" }}
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

import {mapState, mapGetters} from "vuex";

export default {
  name: "CollectionListItem",
  props: {
    collectionId: {
      type: Number,
      required: true,
    }
  },
  data() {
    const collectionsTree =  this.$store.getters["collections/flattenedCollectionsTree"]([this.collectionId])
    return {
      expandedById: Object.fromEntries(collectionsTree.map(col => [col.id, false])),
    }
  },
  computed: {
    ...mapState("collections", ["collectionsById"]),
    ...mapGetters("collections", ["flattenedCollectionsTree"]),
    collection() {
      return this.$store.state.collections.collectionsById[this.collectionId]
    }
  },
  methods: {
    toggleExpanded(collectionId) {
      this.expandedById[collectionId] = !this.expandedById[collectionId]
    },
    parentExpanded(collection) {
      return collection.parent === null || this.expandedById[collection.parent]
    },
    getImgUrl: function (img) {
      try {
        return require('@/assets/images/collections/collection' + img + '.jpg')
      }   catch (e) {
        //console.log('mon erreur : ',e)
        return require('@/assets/images/collections/default.jpg')
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.collection-card {
  background: none !important;
  border: none !important;

  .card-header {
    background-color: #858585;
    border-radius: 5px;
    padding-left: 25px;
    font-family: $family-primary;

    &.expanded {
      background-color: #CB2158;
    }

    a.collection-title {
      flex: 2;
      padding: 0 25px;
      display: inline-block;
      font-size: 30px;
      font-weight: 500;
      line-height: 1.2;
      color: #FFFFFF;
    }

    .collection-infos {
      gap: 10px;
      padding: 0 25px;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
      color: #FFFFFF;
      text-align: right;
      text-transform: uppercase;

      & > .collection-dates span:first-child::after {
        content: ">";
        margin: 0 8px;
      }
    }

    .documents-count {
      font-size: 18px;
      font-weight: 600;
    }

    .documents-count-label {
      font-size: 18px;
      font-weight: 400;
    }

    .collection-thumbnail {
      width: 110px;
      height: 110px;
      padding: 0;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        max-height: unset;
        object-fit: cover;
        object-position: center;
        border-radius: 0;
      }
    }
  }

  .card-header,
  .card-body {
    margin-bottom: 10px;
    box-shadow: none;
  }

  .card-body,
  .card-footer {
    background-color: #F6F6F6;
    border: none;
    border-radius: 5px;
    padding: 25px;
  }

  button,
  .card-body,
  .card-footer {
    font-family: $family-primary;
    font-size: 20px;
    font-weight: 400;
    line-height: 26px;
    color: #707070;
  }

  .card-footer {

    & > div > .child-collection {
      margin-top: 20px;
    }

    & > div > .child-collection ~ .child-collection {
      margin-top: 10px;
    }

    & > div > .child-collection > a {
      color: #858585;
    }

    & > div > .child-collection.expanded > a {
      color: #CB2158;
    }
  }

  .collection-description {
    margin-bottom: 25px;
  }

  .collection-description:empty {
    display: none;
  }

  .collection-metadata {

    label {
      color: #AAAAAA;
    }

    a {
      color: #707070 !important;
    }
  }

  button {
    display: inline-flex;
    align-items: center;
    min-width: 23px;
    height: 20px;
    background: url(../assets/images/icons/expand-collection-right.svg) left bottom / 23px auto no-repeat;
    border: none;
    cursor: pointer;
  }

  .expanded > button {
    background-image: url(../assets/images/icons/expand-collection-down.svg);
    color: #CB2158;
  }

  button.show-children {
    align-self: start;
    padding-left: 30px;
    font-size: 18px;
    text-transform: uppercase;
  }

  button.expand-collection {
    padding: 0;
    width: 23px;
  }

  .card-img-left {
    max-height: 100px;
  }
}
</style>
