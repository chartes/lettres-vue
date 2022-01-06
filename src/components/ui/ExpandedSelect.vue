<template>
  <dl class="expanded-select">
    <dt
      v-for="(item, i) in items"
      :key="item"
      :class="selection === i ? 'expanded-selection' : ''"
      @click="toggleSelection(i)"
    >
      {{ item }}
    </dt>
  </dl>
</template>

<script>
export default {
  name: "ExpandedSelect",
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ["changed"],
  data() {
    return {
      selection: null,
    };
  },
  methods: {
    toggleSelection(i) {
      this.selection = this.selection === i ? null : i;
      this.$emit(
        "changed",
        this.selection === null
          ? {
              index: null,
              item: null,
            }
          : {
              index: i,
              item: this.$props.items[i],
            }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.expanded-select {
  height: 400px;
  min-width: 120px;
  min-height: 120px;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  dt {
    padding: 5px 8px;
    border-bottom: 1px solid $beige-light;

    &:nth-child(even) {
      background-color: whitesmoke;
    }

    &:first-letter {
      text-transform: uppercase;
    }

    &:hover {
      cursor: pointer;
      background: #f0ece3;
    }

    &.expanded-selection {
      background-color: $primary;
      color: white;
    }
  }
}
</style>
