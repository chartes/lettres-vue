<template>
  <div>
    <div v-if="items.length < 1" class="no-image-text is-size-4 has-text-centered">
      Aucune image pour le moment
    </div>
    <div
      v-show="items.length"
      id="manifest-carousel"
      class="carousel-container"
      @mouseover="showNavigation = true"
      @mouseleave="showNavigation = false"
    >
      <span
        v-show="showNavigation"
        class="button is-light is-rounded navigation-left"
        @click="moveLeft"
        ><i class="fas fa-chevron-left"
      /></span>
      <span
        v-show="showNavigation"
        class="button is-light is-rounded navigation-right"
        @click="moveRight"
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
              <button
                class="button is-light is-danger page-action"
                @click="deletePage(i)"
              >
                <i class="fas fa-trash" />
              </button>
              <button
                class="button is-light is-info page-action"
                @click="movePage(i, Math.max(i - 1, 0))"
              >
                <i class="fas fa-chevron-left" />
              </button>
              <button class="button is-light is-info page-action">
                <i
                  class="fas fa-chevron-right"
                  @click="movePage(i, Math.min(i + 1, items.length - 1))"
                />
              </button>
            </span>
          </div>
          <div class="card-content">
            <span class="page-num"
              ><span class="page-index">{{ i + 1 }}</span
              ><span>p.{{ item.num }}</span></span
            >
          </div>
        </div>
      </div>
      <!--
    translationOffset: {{ translationOffset }} | index: {{ index }} (min: {{ minIndex }},
    max: {{ maxIndex }}) -->
      <span class="carousel-info">
        {{ items.length }} page{{ items.length > 1 ? "s" : "" }}
      </span>

      <div v-show="toolTipImageFullUrl && displayPreview" class="tooltip-image-full">
        <b-image :src="toolTipImageFullUrl" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleManifestCarousel",
  emit: ["manage-manifest-data"],
  props: {
    itemWidth: { type: Number, default: 140 },
    displayNum: { type: Number, default: 5 },
    dataItems: { type: Array, required: true },
    startIndex: { type: Number, default: 0 },
    displayPreview: { type: Boolean, default: false },
  },
  data() {
    return {
      index: this.startIndex,
      items: this.dataItems,
      display: this.displayNum,

      showActions: false,
      showNavigation: false,
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
      this.index = 1;
    },
  },
  methods: {
    move(toTheRight = true, next = null) {
      const dir = toTheRight ? 1 : -1;
      next = next ? next : this.index + dir;
      if (next >= this.minIndex && next <= this.maxIndex) {
        this.index = next;
        document.querySelectorAll("#manifest-carousel .card").forEach((e) => {
          e.style.transform = this.translationOffset;
        });
      }
    },
    moveTo(x) {
      this.move(true, -this.index + Math.max(x, 0));
    },
    moveRight() {
      this.move();
    },
    moveLeft() {
      this.move(false);
    },
    onMouseOverPage(item, pageIdx) {
      this.toolTipImageFullUrl = item.fullUrl;
      this.showActions = item.num;
      //if (pageIdx !== this.index && pageIdx !== this.index + this.display - 1) {
      //  this.showActions = item.num;
      //}
    },
    onMouseLeavePage() {
      this.showActions = null;
      this.toolTipImageFullUrl = null;
    },
    deletePage(index) {
      this.$emit("manage-manifest-data", {
        action: { name: "del" },
        data: { index },
      });
      //this.moveTo(index);
    },
    movePage(from, to) {
      this.$emit("manage-manifest-data", {
        action: { name: "move" },
        data: { from, to },
      });
      //this.moveTo(to - 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.no-image-text {
  color: $white-ter;
  padding-top: 100px;
}

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

  .page-num {
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .page-index {
      padding: 2px;
    }
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
  top: calc(50% - 35px);
  left: 22px;
  height: 36px;
  width: 36px;
}

.navigation-right {
  z-index: 1000;
  position: absolute;
  height: 36px;
  width: 36px;
  top: calc(50% - 35px);
  right: calc(0% + 22px);
}
.carousel-info {
  float: right;
  position: sticky;
  right: 12px;
  color: $white-ter;
  padding-top: 5px;
  font-family: $bitter-family;
}
.page-actions {
  position: absolute;
  display: flex;
  z-index: 5000;
  top: 75%;
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

  left: 50%;
  margin-top: 15px;
}
</style>
