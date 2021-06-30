<template>
  <div id="manifest-carousel" class="carousel-container">
    <span class="button is-light navigation-left" @click="moveLeft"
      ><i class="fas fa-chevron-left"
    /></span>
    <span class="button is-light navigation-right" @click="moveRight"
      ><i class="fas fa-chevron-right"
    /></span>

    <div class="card-container">
      <div
        v-for="item in items"
        :key="item.num"
        class="card"
        @mouseover="onMouseOverPage(item)"
        @mouseleave="onMouseLeavePage"
      >
        <div class="card-image">
          <figure :class="`image`">
            <img :src="item.thumbnail.url" :style="`min-width: ${itemWidth}px`" />
          </figure>
        </div>
        <div class="card-content">
          <span class="page-num">{{ item.num }}</span>

          <span v-show="showActions === item.num">
            <button class="button is-small page-action">
              <i class="fas fa-trash" />
            </button>
            <button class="button is-small page-action">
              <i class="fas fa-chevron-left" />
            </button>
            <button class="button is-small page-action">
              <i class="fas fa-chevron-right" />
            </button>
          </span>
        </div>
      </div>
    </div>

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
      offset: this.itemWidth + 10 + 10,
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
      return Math.ceil(this.items.length - 0.5 * this.display);
    },
  },
  watch: {
    dataItems() {
      this.items = this.dataItems;
    },
  },
  methods: {
    move(toTheRight = true) {
      const dir = toTheRight ? -1 : 1;
      const next = this.index + -dir;
      if (next >= this.minIndex && next < this.maxIndex) {
        document.querySelectorAll("#manifest-carousel .card").forEach((e) => {
          e.style.transform += `translateX(${dir * this.offset}px)`;
        });
        this.index += -dir;
      }
    },
    moveRight() {
      this.move();
    },
    moveLeft() {
      this.move(false);
    },
    onMouseOverPage(item) {
      this.showActions = item.num;
      this.toolTipImageFullUrl = item.fullUrl;
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
  transition: transform 0.5s ease;
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
  top: calc(50% - 30px);
  left: 22px;
  height: 50px;
}

.navigation-right {
  z-index: 1000;
  position: absolute;
  height: 50px;
  top: calc(50% - 30px);
  right: calc(0% + 22px);
}

.page-action {
  padding: 2px;
  height: 22px;
  width: 24px;
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
