<template>
  <div class="image-grid-container">
    <div class="image-area">
      <div class="no-image-text is-size-4 has-text-centered">
        Aucune image pour le moment
      </div>
    </div>
    <div class="navbar-area" />

    <div class="metadata-area">
      <div class="source-selection-table">
        <b-table
          :data="data"
          :show-header="false"
          :selected.sync="selected"
          hoverable
        >
          <b-table-column
            v-for="(column, index) in columns"
            :key="index"
            v-slot="props"
            :label="column.label"
            :visible="column.visible"
          >
            {{ props.row[column.field] }}
          </b-table-column>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageSourceForm",
  emits: ["select-image-source"],

  props:['imageSource'],

  data() {
    const data = [
        {'name': null, 'src':'Aucune image'},
        {'name': 'gallica', 'src': 'Gallica'},
        {'name': 'upload', 'src': 'Téléversement'},
        {'name': 'iiif-server', 'src': 'iiif.chartes.psl.eu'}
    ]

    return {
                data,
                selected: data[0],
                columns: [
                    {
                        field: 'src',
                        label: 'First Name',
                        visible: true
                    },
                    {
                      field: 'name',
                      visible: false
                    }
                ]
    }
  },
  watch: {
    selected() {
      this.$emit('select-image-source',  this.selected)
    }
  }

};
</script>


<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

  .image-area {
    grid-area: image-viewer;
    background-color: black;

    .no-image-text {
      color: white;
      margin: 100px auto;
    }
  }
  .navbar-area {
    grid-area: navbar;
    border-bottom: 1px solid $beige-light;
    box-shadow: 2px 0px 3px 0px rgb(10 10 10 / 30%);

    background-color: $white;

  }
  .metadata-area {
    grid-area: metadata;

    .source-selection-table {
      margin-top: 1px;
    }

  }
  .image-grid-container {
    display: grid;
    min-height: 100%;

    grid-template-columns: auto;
    grid-template-rows: 230px 10px auto;
    grid-template-areas:
      "image-viewer"
      "navbar"
      "metadata";
  }
</style>