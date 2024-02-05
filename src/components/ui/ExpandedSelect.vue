<template>
  <dl
    v-if="items.length > 0"
    class="expanded-select"
  >
    <dt
      v-for="(item, i) in items"
      :key="item"
      :class="selection === i ? 'expanded-selection' : ''"
      @click="toggleSelection(i)"
    >
      {{ item }}
    </dt>
  </dl>
  <dl
    v-else
    class="expanded-select"
  >
    <dt>
      Aucune suggestion
    </dt>
  </dl>
</template>

<script>
export default {
  name: "ExpandedSelect",
  props: {
    items: { type: Array, default: () => [] },
    selectedIndex: { type: Number, default: null },
    updatedFunction: { type: String, default: ''}
  },
  emits: ["changed"],
  data() {
    return {
      selection: null,
    };
  },
  watch: {
    items(newVal, OldVal) {
      if (this.$props.items.length === 1 && this.$props.items[0].toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") === this.$props.updatedFunction.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) {
        this.setSelection(this.selectedIndex);
      } else this.selection = null

    },
    selectedIndex() {
      if (this.selectedIndex !== this.selection) {
        this.setSelection(this.selectedIndex);
      }
    },
  },
  created() {
    this.setSelection(this.selectedIndex);
  },
  methods: {
    setSelection(i) {
      this.selection = this.selectedIndex;
    },
    toggleSelection(i) {
      this.selection = this.selection === i ? null : i;
      console.log("toggleSelection", this.selection, i, this.$props.items)
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
  min-width: 120px;
  min-height: 0px;

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
