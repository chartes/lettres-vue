<template>
  <div class="image-grid-container">
    <div class="image-area">
      <div v-if="pages.length < 1" class="no-image-text is-size-4 has-text-centered">
        Aucune image pour le moment
      </div>
      <div v-else>
        <b-carousel-list :data="pages" arrow arrow-hover opacity :items-to-show="3" />
      </div>
    </div>
    <div class="navbar-area" />
    <div class="metadata-area">
      <section>
        <div class="columns">
          <div class="column">
            <div>
              <p class="label">Prévisualisation des pages à importer</p>
              <div class="field is-grouped">
                <div class="control image-preview">
                  <b-skeleton
                    v-if="firstPageImageUrl === null || firstPageError"
                    :width="`${previewWidth}px`"
                    :height="`${previewHeight}px`"
                    :animated="false"
                  />
                  <div
                    v-else
                    @mouseover="toolTipImageFullIndex = startPageIndex"
                    @mouseleave="toolTipImageFullIndex = null"
                  >
                    <b-image
                      :src="firstPageImageUrl.url"
                      @error="firstPageError = true"
                    />
                  </div>
                </div>
                <div class="control image-preview">
                  <b-skeleton
                    v-if="lastPageImageUrl === null || lastPageError"
                    :width="`${previewWidth}px`"
                    :height="`${previewHeight}px`"
                    :animated="false"
                  />
                  <div
                    v-else
                    @mouseover="toolTipImageFullIndex = endPageIndex"
                    @mouseleave="toolTipImageFullIndex = null"
                  >
                    <b-image :src="lastPageImageUrl.url" @error="lastPageError = false" />
                  </div>
                </div>
              </div>
              <div class="field is-grouped">
                <p class="control">
                  <b-field>
                    <b-numberinput
                      v-model="startPageIndex"
                      :min="1"
                      :max="manifestPageCount"
                      class="number-input"
                      size="is-small"
                      controls-position="compact"
                    />
                  </b-field>
                </p>
                <p class="control">
                  <b-field>
                    <b-numberinput
                      v-model="endPageIndex"
                      :min="startPageIndex"
                      :max="manifestPageCount"
                      size="is-small"
                      class="number-input"
                      controls-position="compact"
                    />
                  </b-field>
                </p>
              </div>
            </div>
            <p class="control import-button">
              <b-button
                type="is-primary is-info"
                :disabled="!manifest"
                @click="addSelectedPages"
              >
                Importer la sélection ({{ pageRangeSize }} page{{
                  pageRangeSize > 1 ? "s" : ""
                }})
              </b-button>
            </p>
          </div>
        </div>
      </section>

      <div v-if="toolTipImageFullUrl" class="tooltip-image-full">
        <b-image :src="toolTipImageFullUrl.url" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManifestCreationForm",
  data() {
    return {
      startPageIndex: 1,
      endPageIndex: 1,
      toolTipImageFullIndex: null,
      //insertionPageIndex: 1,

      previewWidth: 120,
      previewHeight: 160,

      firstPageError: false,
      lastPageError: false,

      pages: [],
    };
  },
  computed: {
    pageRangeSize() {
      return this.endPageIndex - this.startPageIndex + 1;
    },
    manifest() {
      return this.$attrs.manifest;
    },
    manifestPageCount() {
      if (this.manifest) {
        return this.manifest.sequences[0].canvases.length;
      } else {
        return 0;
      }
    },
    firstPageImageUrl() {
      return this.getImageUrl(this.startPageIndex, this.firstPageError);
    },
    lastPageImageUrl() {
      return this.getImageUrl(this.endPageIndex, this.lastPageError);
    },
    toolTipImageFullUrl() {
      if (this.manifest && this.toolTipImageFullIndex) {
        return this.getImageUrl(this.toolTipImageFullIndex, false, true);
      } else {
        return null;
      }
    },
  },
  watch: {
    startPageIndex() {
      this.firstPageError = false;
      if (this.startPageIndex > this.endPageIndex) {
        this.endPageIndex = this.startPageIndex;
      }
    },
    endPageIndex() {
      this.lastPageError = false;
    },
    manifest() {
      this.startPageIndex = 1;
      this.endPageIndex = this.manifestPageCount;
    },
  },
  methods: {
    getImageUrl(index, error, full = false) {
      if (this.manifest && !error) {
        // this is iiif presentation v2
        const canvas = this.manifest.sequences[0].canvases[index - 1];
        const url = canvas.images[0].resource["@id"];
        return {
          url: full
            ? url.replace("/full/full/", `/full/${this.previewWidth * 4},/`)
            : url.replace(
                "/full/full/",
                `/full/${this.previewWidth},${this.previewHeight}/`
              ),
        };
      } else {
        return null;
      }
    },
    addSelectedPages() {
      for (let i = this.startPageIndex; i < this.endPageIndex + 1; ++i) {
        const image = this.getImageUrl(i, false);
        this.pages.push({
          //canvas: this.manifest.sequences[0].canvases[i - 1],
          thumbnail: image,
          title: i,
          image: image.url,
        });
      }
    },
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

  padding-top: 20px;
  padding-left: 12px;
  padding-right: 12px;

  .source-selection-table {
    margin-top: 1px;
  }

  .number-input {
    width: 132px;
  }
  .url-input {
    width: 400px;
  }

  .image-preview {
    margin-top: 0px;
    margin-right: 12px;
    &:hover {
      cursor: pointer;
    }
  }

  .tooltip-image-full {
    padding: 10px;
    background-color: $white;
    border-radius: 5px;
    box-shadow: 2px 2px 14px 0px rgb(10 10 10 / 40%);
    position: absolute;
    z-index: 1000;
    width: 480px;
    height: 100%;
    top: 20px;
    right: 20px;
  }

  .import-button {
    margin-top: 12px;
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
