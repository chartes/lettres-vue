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
      <div v-if="selected.name === 'gallica'" class="gallica-form">
        <b-field label="URL de la ressource" :message="loadingMsg" :type="loadingMsgType">
          <b-input
            v-model="inputGallicaUrl"
            class="url-input"
            placeholder="https://gallica.bnf.fr/ark:/12148/bpt6k1521194n"
            type="url"
            :disabled="pagesHaveBeenCollected"
            expanded
          />
          <p class="control">
            <b-button
              class="button is-primary"
              :disabled="loadingManifest || !inputGallicaUrl"
              :loading="loadingManifest"
              @click="validateGallicaUrl"
            >
              Valider
            </b-button>
          </p>
        </b-field>

        <b-message v-if="pagesHaveBeenCollected" type="is-warning is-small" has-icon>
          Impossible de changer la source du document pour le moment. Supprimez toutes les
          pages collectées et réessayez.
        </b-message>

        <div v-if="manifest" class="source-desc block">
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img :src="manifest.logo" alt="Image" />
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{ manifest.label }}</strong>
                  <br /><small>{{ manifest.attribution }}</small> <br /><br />
                  {{ manifest.description }}
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item" aria-label="reply">
                    {{ manifest.license }}
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  name: "ImageSourceForm",
  emits: ["manage-manifest-data"],

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
      gallicaRegexp: /(ark:\/\d+\/[a-z0-9]+)/,
      manifest: null,

      loadingManifest: false,
      loadingMsg: null,
      loadingMsgType: null,
    };
  },
  computed: {
    pagesHaveBeenCollected() {
      return this.$attrs.collectedPages && this.$attrs.collectedPages.length > 0;
    },
  },
  watch: {
    selected() {
      this.inputGallicaUrl = null;
      this.manifest = null;
    },
    manifest() {
      this.$emit("manage-manifest-data", {
        action: { name: "set" },
        data: { manifest: this.manifest },
      });
    },
  },
  methods: {
    validateGallicaUrl() {
      this.manifest = null;
      if (this.inputGallicaUrl) {
        this.fetchGallicaManifestUrl();
      }
    },
    async getGallicaIIIFUrl() {
      if (this.inputGallicaUrl) {
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
      this.loadingManifest = true;
      try {
        const url = await this.getGallicaIIIFUrl();
        if (url) {
          const response = await fetch(url);
          this.manifest = await response.json();
          this.loadingMsg = "";
          this.loadingMsgType = "is-success";
        } else {
          this.loadingMsg = "L'url ne correspond pas au format de la source sélectionnée";
          this.loadingMsgType = "is-danger";
        }
      } catch (e) {
        this.manifest = null;
        this.loadingMsg =
          "Erreur lors de la récupération du manifeste d'images, impossible de récupérer la ressource" +
          `(${e})`;
        this.loadingMsgType = "is-danger";
      } finally {
        this.loadingManifest = false;
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
  padding-right: 256px;
}

.source-desc {
  margin-top: 35px;
}
</style>
