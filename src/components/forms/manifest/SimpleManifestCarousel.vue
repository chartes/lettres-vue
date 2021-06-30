<template>
  <div id="manifest-carousel" class="carousel-container">
    <span class="button is-light is-rounded navigation-left" @click="moveLeft"
      ><i class="fas fa-chevron-left"
    /></span>
    <span class="button is-light is-rounded navigation-right" @click="moveRight"
      ><i class="fas fa-chevron-right"
    /></span>

    <div class="card-container">
      <div
        v-for="(item, i) in items"
        :key="item.num"
        class="card"
        @mouseover="onMouseOverPage(item, i)"
        @mouseleave="onMouseLeavePage"
      >
        <div class="card-image">
          <figure :class="`image`">
            <img :src="item.thumbnail.url" :style="`min-width: ${itemWidth}px`" />
          </figure>
          <span v-show="showActions === item.num" class="page-actions">
            <button class="button is-light is-danger page-action">
              <i class="fas fa-trash" />
            </button>
            <button class="button is-light is-info page-action">
              <i class="fas fa-chevron-left" />
            </button>
            <button class="button is-light is-info page-action">
              <i class="fas fa-chevron-right" />
            </button>
          </span>
        </div>
        <div class="card-content">
          <span class="page-num">{{ i + 1 }} - p.{{ item.num }}</span>
        </div>
      </div>
    </div>
    <!--
    translationOffset: {{ translationOffset }} | index: {{ index }} (min: {{ minIndex }},
    max: {{ maxIndex }}) -->
    <div v-show="toolTipImageFullUrl" class="tooltip-image-full">
      <b-image :src="toolTipImageFullUrl" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleManifestCarousel",
  props: {
    itemWidth: { type: Number, default: 140 },
    displayNum: { type: Number, default: 5 },
    dataItems: { type: Array, required: true },
    startIndex: { type: Number, default: 0 },
  },
  data() {
    return {
      index: this.startIndex,
      items: this.dataItems,
      display: this.displayNum,

      showActions: false,
      toolTipImageFullUrl: null,
    };
  },
  computed: {
    minIndex() {
      return -Math.floor(this.display * 0.5);
    },
    maxIndex() {
      return Math.max(this.items.length - Math.floor(this.display * 0.5) - 1, 0);
    },
    translationOffset() {
      const width = this.itemWidth + 10 + 10;
      return `translateX(${-this.index * width}px)`;
    },
  },
  watch: {
    dataItems() {
      this.items = this.dataItems;
    },
  },
  methods: {
    move(toTheRight = true) {
      const dir = toTheRight ? 1 : -1;
      const next = this.index + dir;
      if (next >= this.minIndex && next <= this.maxIndex) {
        this.index = next;
        document.querySelectorAll("#manifest-carousel .card").forEach((e) => {
          e.style.transform = this.translationOffset;
        });
      }
    },
    moveRight() {
      this.move();
    },
    moveLeft() {
      this.move(false);
    },
    onMouseOverPage(item, pageIdx) {
      if (pageIdx !== this.index && pageIdx !== this.index + this.display - 1) {
        this.showActions = item.num;
        this.toolTipImageFullUrl = item.fullUrl;
      }
    },
    onMouseLeavePage() {
      this.showActions = null;
      this.toolTipImageFullUrl = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.card-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.card {
  margin-left: 10px;
  margin-right: 10px;
  transition: transform 0.4s ease;
}

.card-content {
  overflow: hidden;
  padding: 5px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .page-num {
    padding-left: 5px;
  }
}
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  top: 32px;
  overflow: hidden;
}

.navigation-left {
  z-index: 1000;
  position: absolute;
  top: calc(50% - 20px);
  left: 22px;
  height: 42px;
}

.navigation-right {
  z-index: 1000;
  position: absolute;
  height: 42px;
  top: calc(50% - 20px);
  right: calc(0% + 22px);
}

.page-actions {
  position: absolute;
  display: flex;
  z-index: 5000;
  top: 50%;
  width: 100%;

  justify-content: space-evenly;
  align-items: center;
  align-content: space-around;
}

.page-action {
  height: 36px;
  width: 36px;
  border: none;
}

.tooltip-image-full {
  padding: 10px;
  background-color: $white;
  border-radius: 5px;
  box-shadow: 2px 2px 14px 0px rgb(10 10 10 / 40%);
  position: fixed;
  z-index: 1000;

  right: 20px;
  margin-top: 15px;
}
</style>
