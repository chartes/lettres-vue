<template>
  <div>
    <div class="source-selection-table">
      <b-table
        :data="data"
        :show-header="false"
        :selected.sync="selected"
        hoverable
        striped
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
    <div class="division" />

    <div v-if="selected" class="input-form">
      <div v-if="selected.name === 'gallica'" id="gallica">
        <b-field
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
      { name: "gallica", src: "Importer les images depuis Gallica" },
      {
        name: "iiif-server",
        src: "Utiliser les images disponibles sur https://iiif.chartes.psl.eu",
      },
      { name: "upload", src: "Téléverser des images" },
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
      this.$emit("set-source-manifest", this.manifest);
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

.division {
  height: 8px;
  margin-top: 10px;
  border-bottom: 1px solid $beige-light;
  box-shadow: 2px 0px 3px 0px rgb(10 10 10 / 30%);
  background-color: $white;
}
.source-selection-table {
  margin-top: 20px;
}

.input-form {
  margin-top: 20px;
  padding-left: 16px;
  padding-right: 128px;
}
</style>
