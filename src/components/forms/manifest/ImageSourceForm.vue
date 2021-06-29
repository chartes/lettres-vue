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
        <b-table :data="data" :show-header="false" :selected.sync="selected" hoverable>
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

      <b-field
        v-if="selected && selected.name === 'gallica'"
        label="URL de la ressource"
        :message="inputGallicaUrlMsg"
        :type="inputGallicaUrlMsgType"
      >
        <b-input
          v-model="inputGallicaUrl"
          class="url-input"
          placeholder="https://gallica.bnf.fr/ark:/12148/bpt6k1521194n"
          type="url"
        />
      </b-field>
      https://gallica.bnf.fr/ark:/12148/bpt6k3045360j/
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  name: "ImageSourceForm",
  emits: ["set-source-manifest"],

  data() {
    const data = [
      { name: null, src: "Aucune image" },
      { name: "gallica", src: "Gallica" },
      { name: "upload", src: "Téléversement" },
      { name: "iiif-server", src: "iiif.chartes.psl.eu" },
    ];

    return {
      data,
      selected: data[0],
      columns: [
        {
          field: "src",
          label: "First Name",
          visible: true,
        },
        {
          field: "name",
          visible: false,
        },
      ],

      inputGallicaUrl: null,
      gallicaRegexp: /(ark:\/\d+\/[a-z0-9]+[a-z])/,
      manifest: null,
    };
  },
  computed: {
    inputGallicaUrlMsg() {
      if (this.inputGallicaUrl && this.inputGallicaUrl.length > 5) {
        return this.getGallicaIIIFUrl()
          ? ""
          : "L'url ne correspond pas au format attendu";
      } else {
        return "";
      }
    },
    inputGallicaUrlMsgType() {
      if (this.inputGallicaUrl && this.inputGallicaUrl.length > 5) {
        return this.getGallicaIIIFUrl() ? "is-success" : "is-danger";
      } else {
        return "";
      }
    },
  },
  watch: {
    selected() {
      this.inputGallicaUrl = null;
      this.manifest = null;
    },
    inputGallicaUrl() {
      if (this.inputGallicaUrl) {
        this.fetchGallicaManifestUrl();
      }
    },
    manifest() {
      this.$emit("set-source-manifest", {
        manifest: this.manifest,
      });
      console.log("emit", this.manifest);
    },
  },
  methods: {
    async getGallicaIIIFUrl() {
      if (this.inputGallicaUrl) {
        console.log("get fallica url", this.inputGallicaUrl);

        const ark = this.inputGallicaUrl.match(this.gallicaRegexp);
        if (!ark) {
          return false;
        } else {
          const url = `https://gallica.bnf.fr/iiif/${ark[0]}/manifest.json`;
          const resp = await fetch(url, { method: "HEAD" });
          return resp.ok ? url : false;
        }
      } else {
        return false;
      }
    },
    fetchGallicaManifestUrl: debounce(async function () {
      const url = await this.getGallicaIIIFUrl();
      if (url) {
        const response = await fetch(url);
        this.manifest = await response.json();
        /*
        this.lastPageError = false;
        this.firstPageError = false;
        this.startPageIndex = 1;
        this.endPageIndex = this.manifestPageCount;
        */
      }
    }, 1000),
  },
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
