<template>
  <div class="document-details-container">
    <div
      v-if="searchType === 'isFullTextSearch' && transcriptionHightlight && transcriptionHightlight.length > 0 && Array.isArray(transcriptionHightlight)"
    >
      <div class="transcript-container">
        <div class="transcript-icon" />
        <p 
          class="details-content"
        >
          <span
            v-for="(phrase, index) in transcriptionHightlight"
            :key="index"
            class="transcript-phrase"
            v-html="phrase"
          />
        </p>
      </div>
    </div>
    <div
      v-if="(searchType === 'isParatextSearch' || !searchType) && argument && argument.length > 0"
    >
      <div class="heading">
        Analyse
      </div>
      <div class="argument-container">
        <p
          class="details-content"
          v-html="highlight(argument)"
        />
      </div>
    </div>
    <div
      v-if="(searchType === 'isParatextSearch' || !searchType) && witnesses && witnesses.length > 0"
    >
      <div class="heading">
        Témoins
      </div>
      <div
        v-for="(witness, index) in witnesses"
        :key="index"
        class="witness-container"
      >
        <button
          class="eye-btn"
          :disabled="!witness.manifest_url"
          @click="toggleMirador(witness.manifest_url)"
        />
        <div class="witness-item-container">
          <p 
            class="details-content"
            v-html="witness.content"
          />
        </div>
      </div>
    </div>
    <mirador-viewer
      v-if="(searchType === 'isParatextSearch' || !searchType) && displayedManifestUrl"
      class="mirador-container"
      :manifest-url="displayedManifestUrl"
      :window-id="documentId.toString()"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MiradorViewer from "@/components/MiradorViewer.vue";
import escapeRegExp from "lodash/escapeRegExp";


export default {
  name: "DocumentListDetails",
  components: {
    MiradorViewer,
  },
  props: {
    "documentId": {
      type: Number,
      required: true,
    },
    "transcriptionHightlight": {
        type: Array,
        default: undefined,
        required: false,
    },
    "argument": {
        type: String,
        default: undefined,
        required: false,
    },
    "witnesses": {
      type: Array,
      default: undefined,
      required: false,
    }
  },
  data() {
    return {
      displayedManifestUrl: undefined
    }
  },
  created() {
    console.log("this.witnesses ", this.$props.witnesses)
  },
  computed: {
    ...mapState("search", ["searchTerm", "searchType"])
  },
  methods: {
    toggleMirador: function(newUrl) {
      console.log("toggleMirador newUrl", newUrl)
      if (this.displayedManifestUrl === newUrl) {
        this.displayedManifestUrl = undefined
      } else {
        this.displayedManifestUrl = newUrl
      }
    },
    highlight(text) {
      if (!text || !this.searchTerm) {
        return text
      }
      const terms = this.searchTerm.replaceAll(/^"|"$/g, "").split(new RegExp("[,;:.\\s+]+")).map(escapeRegExp).filter(term => term !== "");
      if (!terms) {
        return text
      }
      const re = new RegExp(`(?:(?!\\w)|\\b(?=\\w))(${terms.join("|")})(?:(?<=\\w)\\b|(?<!\\w))(?=[^<>]*<)`);
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`));
    },
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.document-details-container {
  display: flex;
  flex-direction: column;
  padding: 10px 30px;
  gap: 30px;
}

.transcript-container {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.transcript-icon {
  background-image: url(../../assets/images/icons/citation-guillemet.svg);
  width: 38px;
  height: 38px;
  margin: 0 40px 0 0;
  padding: 0;
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  @include on-mobile {
    font-size: $font-size-text-mobile;
  margin: 0 20px 0 0;
  }
}

.witness-container {
  display: flex;
  flex-direction: row;
}

.eye-btn {
  background-image: url(../../assets/images/icons/bouton_voir.svg);
  width: 35px;
  height: 30px;
  margin: 0 10px 0 0;
  padding: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  &:not([disabled]) {
    cursor: pointer;
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.heading {
    display: flex;
    gap: 2px;
    margin-bottom: 20px;

    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    color: #CB2158;
    letter-spacing: 0;
    text-transform: uppercase;
    font-family: $family-primary;

    @include on-mobile {
      margin-bottom: 10px;
      font-size: 13px;
    }

    &::after {
      display: block;
      content: '';
      width: 100%;
      border-bottom: 1px solid #D2D2D2;
      transform: translateY(-2px);
    }
  }

.argument-container {
  padding-left: 70px;

  @include on-mobile {
    padding-left: 50px;
  }
}

.witness-item-container {
  padding-left: 30px;
  flex: 1;

  @include on-mobile {
    padding-left: 10px;
  }
}

.details-content {
  font-size: 20px;
  font-weight: 400;
  font-family: $family-primary;
  flex: 1;

  @include on-mobile {
    font-size: $font-size-text-mobile;
  }

  ::v-deep a {
    font-family: $family-secondary;
    color: #000000;
    background-color: transparent !important;
    line-height: 20px;
    overflow-wrap: break-word;

    &:hover {
      color: #CB2158 !important;
      text-decoration: underline;
      text-decoration-style: dotted;
      text-underline-offset: 4px;

      @include on-mobile {
        color: #FFF !important;
        opacity: 0.5;
      }
    }
  }
}
::v-deep em {
  background-color: #ffec00;
  border-radius: 3px;
  font-style: normal;
  padding: 0px 5px 4px 5px;
}
::v-deep mark {
  background-color: #ffec00;
  border-radius: 3px;
  font-style: normal;
  padding: 0px 5px 4px 5px;
}
.transcript-phrase:after {
  content: " [...] ";
  /*content: " [...]\A";
  white-space: pre-wrap;*/
  font-weight: bold;
  padding-right: 5px;
}

</style>
