<template>
  <div class="manifest-creation-form">
    <div class="image-area" style="position: relative">
      <simple-manifest-carousel
        :item-width="140"
        :display-num="5"
        :data-items="pages"
        @manage-manifest-data="manageManifestData"
      />
    </div>
    <div class="navbar-area" />
    <div class="metadata-area">
      <section>
        <div class="columns">
          <div class="column is-two-fifths">
            <div>
              <p class="label">Sélection des images</p>

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
          </div>
          <div class="column">
            <div class="manage-manifest-buttons">
              <p class="control import-button">
                <b-button type="is-light" :disabled="!manifest" @click="addSelectedPages">
                  Ajouter la sélection
                </b-button>
              </p>
              <p class="control import-button">
                <b-button
                  type="is-danger is-light"
                  :disabled="!manifest"
                  @click="deleteAllPages"
                >
                  Tout supprimer
                </b-button>
              </p>
            </div>
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
import SimpleManifestCarousel from "@/components/forms/manifest/SimpleManifestCarousel.vue";

export default {
  name: "ManifestCreationForm",
  components: {
    SimpleManifestCarousel,
  },
  emit: ["manage-manifest-data"],
  data() {
    return {
      startPageIndex: 1,
      endPageIndex: 1,
      toolTipImageFullIndex: null,
      //insertionPageIndex: 1,

      previewWidth: 140,
      previewHeight: 180,

      firstPageError: false,
      lastPageError: false,

      //pages: [],
    };
  },
  computed: {
    pageRangeSize() {
      return this.endPageIndex - this.startPageIndex + 1;
    },
    manifest() {
      return this.$attrs.manifest;
    },
    pages() {
      return this.$attrs.collectedPages;
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
      const newStart = Math.max(...this.pages.map((p) => p.num));
      this.startPageIndex = Math.max(
        newStart < this.manifestPageCount ? newStart + 1 : newStart,
        1
      );
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
            ? url.replace("/full/full/", `/full/${this.previewWidth * 3},/`)
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
      let newItems = [];
      for (let i = this.startPageIndex; i < this.endPageIndex + 1; ++i) {
        const image = this.getImageUrl(i, false);
        const fullImage = this.getImageUrl(i, false, true);
        //avoid duplicates
        if (this.pages.find((p) => p.num === i)) {
          continue;
        }
        newItems.push({
          //canvas: this.manifest.sequences[0].canvases[i - 1],
          thumbnail: image,
          title: i,
          fullUrl: fullImage.url,
          num: i,
        });
        //this.pages.push(item);
      }

      if (newItems.length > 0) {
        this.manageManifestData({
          action: { name: "add", index: this.pages.length },
          data: newItems,
        });
      }
    },
    deleteAllPages() {
      this.manageManifestData({
        action: { name: "del" },
        data: {},
      });
    },
    manageManifestData({ action, data }) {
      this.$emit("manage-manifest-data", { action, data });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.image-area {
  background-color: black;
  width: 800px;
  height: 280px;

  .no-image-text {
    color: white;
    margin: 100px auto;
  }
}

.navbar-area {
  height: 8px;
  border-bottom: 1px solid $beige-light;
  box-shadow: 2px 0px 3px 0px rgb(10 10 10 / 30%);

  background-color: $white;
}
.metadata-area {
  padding-top: 20px;
  padding-left: 12px;
  padding-right: 12px;

  .source-selection-table {
    margin-top: 1px;
  }

  .number-input {
    width: 140px;
  }

  input {
    width: 400px;
  }

  .image-preview {
    margin-top: 0px;
    margin-right: 12px;
  }

  .tooltip-image-full {
    padding: 10px;
    background-color: $white;
    border-radius: 5px;
    box-shadow: 2px 2px 14px 0px rgb(10 10 10 / 40%);
    position: absolute;
    z-index: 1000;

    top: 20px;
    right: 20px;
  }

  .manage-manifest-buttons {
    margin-top: 33px;
    margin-left: 12px;
    button {
      width: 180px;
      margin-bottom: 8px;
    }
  }
}
</style>
