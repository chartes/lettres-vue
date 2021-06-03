<template>
  <div v-if="!previewData">
    <document-preview-card-skeleton />
  </div>
  <div
    v-else
    class="document-preview-card"
  >
    <aside
      class="document-preview-card__thumbnail"
    >
      <router-link :to="{ name: 'document', params: { docId } }">
        <img
          v-if="previewData.attributes['iiif-thumbnail-url']"
          :src="previewData.attributes['iiif-thumbnail-url']"
          @error="imageLoadingError=true"
        >
        <div
          v-if="imageLoadingError || !previewData.attributes['iiif-thumbnail-url']"
          class="document-preview-card__alt-thumbnail"
        >
          <div style="width:100%; height: 100%; margin: auto">
            <i class="far fa-file-alt" />
          </div>
        </div>
      </router-link>
    </aside>
    <article>
      <router-link :to="{ name: 'document', params: { docId } }">
        <h2
          class="document-preview-card__title"
          v-html="previewData.attributes.title"
        />
      </router-link>
      <p
        class="document-preview-card__content"
        v-html="previewContent"
      />
    </article>
    <section v-if="previewData">
      <!-- témoins -->
      <document-witnesses
        :editable="false"
        :list="previewData.witnesses"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { baseAppURL } from "@/modules/http-common";
import DocumentPreviewCardSkeleton from '../ui/DocumentPreviewCardSkeleton.vue';
import DocumentWitnesses from '@/components/document/DocumentWitnesses';

export default {
  name: "DocumentPreviewCard",
  components: { 
    DocumentPreviewCardSkeleton,
    DocumentWitnesses
  },
  props: {
    docId: { required: true, type: Number },
  },
  data() {
    return {
      baseUrl: baseAppURL,
      imageLoadingError: false,
      previewData: null
    };
  }, 
  computed: {
    ...mapGetters('document', ['getPreview']),

    previewContent() {
      return this.previewData.attributes.transcription
          ? this.previewData.attributes.transcription
          : this.previewData.attributes.argument;
    }
  },
  async created () {
    this.previewData = await this.getPreview(this.docId)
  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.document-preview-card__persons ul {
  list-style: none;
}

.document-preview-card {
  margin-bottom: 4em;
  margin-top: 0.5em;
}
.document-preview-card__header {
  margin-bottom: 30px;
}
.document-preview-card__thumbnail {
  float: left;
  margin-right: 40px;
  width: 128px;
  height: 170px;
  min-width: 128px;
  min-height: 170px;
}

.document-preview-card__title {
  color: $almost-black;
  font-weight: 500;
  font-size: 22px;
  padding-bottom: 0.5em;
}

.document-preview-card__title:hover {
  color: initial;
}

.document-preview-card__alt-thumbnail {
  color: lightgray;
  font-size: 128px;
}

/* styles for '...' */
.document-preview-card__content {
  /* hide text if it more than N lines  */
  overflow: hidden;
  /* for set '...' in absolute position */
  position: relative;
  /* use this value to count block height */
  line-height: 1.2em;
  /* max-height = line-height (1.2) * lines max number (3) */
  max-height: 3.6em;
  /* fix problem when last visible word doesn't adjoin right side  */
  text-align: justify;
  /* place for '...' */
  margin-right: -1em;
  padding-right: 1em;
}
/* create the ... */
.document-preview-card__content:before {
  /* points in the end */
  content: "...";
  /* absolute position */
  position: absolute;
  /* set position to right bottom corner of block */
  right: 0;
  bottom: 0;
}
/* hide ... if we have text, which is less than or equal to max lines */
.document-preview-card__content:after {
  /* points in the end */
  content: "";
  /* absolute position */
  position: absolute;
  /* set position to right bottom corner of text */
  right: 0;
  /* set width and height */
  width: 1em;
  height: 1em;
  margin-top: 0.2em;
  /* bg color = bg color under block */
  background: white;
}
</style>