<template>
  <div class="document__transcription">
    <div class="panel">
      <div
        v-if="!preview"
        class="panel-block"
        style="display: inline-block; width: 100%"
      >
        <h3 class="heading">
          Adresse
        </h3>
        <span
          v-if="!preview && editable && !editModeAddress"
          class="edit-btn"
          @click="enterEditModeAddress"
        />
        <rich-text-editor
          v-if="editable && editModeAddress"
          v-model="addressContent"
          :formats="[['close'], ['italic', 'superscript'], ['person', 'location'], ['note']]"
          @add-place="addPlace($event, 'address')"
          @add-person="addPerson($event, 'address')"
          @add-note="addNote($event)"
          @on-keyup-escape="cancelAddressInput($event)"
        >
          <editor-save-button
            :doc-id="document.id"
            name="address"
            :value="addressContent"
          />
          <div
            class="close__button"
            @click="cancelAddressInput"
          />
        </rich-text-editor>
        <div
          v-else-if="!preview && searchTerm && highlight(addressContent).includes('mark')"
          class="document__transcription--content"
          v-html="highlight(addressContent)"
        />
        <div
          v-else
          class="document__transcription--content"
          v-html="addressContent && addressContent.length > 0 ? addressContent : 'Non renseignée'"
        />
      </div>

      <div
        class="panel-block document__transcription--tr-content"
        style="display: inline-block; width: 100%"
      >
        <h3
          v-if="!preview"
          class="heading"
        >
          Lettre
        </h3>
        <span
          v-if="!preview && editable && !editModeTranscription"
          class="edit-btn"
          @click="enterEditModeTranscription"
        />
        <rich-text-editor
          v-if="editable && editModeTranscription"
          v-model="transcriptionContent"
          :formats="[['close'], ['italic', 'superscript', 'page'], ['person', 'location'], ['note']]"
          @add-place="addPlace($event, 'transcription')"
          @add-person="addPerson($event, 'transcription')"
          @add-note="addNote($event)"
          @on-keyup-escape="cancelTranscriptionInput($event)"
        >
          <editor-save-button
            :doc-id="document.id"
            name="transcription"
            :value="transcriptionContent"
          />
        </rich-text-editor>
        <div
          v-else-if="preview && searchTerm && Array.isArray(transcriptionContent)"
          class="document__transcription--content"
        >
          <span
            v-for="(phrase, index) in transcriptionContent"
            class="highlighted"
            :key="index"
            v-html="phrase"
          >
            <!--<span
              v-html="phrase"
              class="highlighted"
            />-->
          </span>
        </div>
        <div
          v-else-if="!preview && searchTerm && highlight(transcriptionContent).includes('mark')"
          class="document__transcription--content"
        >
          <span v-for="(phrase, index) in highlight(transcriptionContent).replaceAll('</p>', '</p>###').split('###')" :key="index">
            <span
              v-html="phrase"
            />
          </span>
        </div>
        <div
          v-else-if="preview"
          class="document__transcription--content"
          v-html="truncate(transcriptionContent, 399, true)"
        >
        </div>
        <div
          v-else
          class="document__transcription--content"
          v-html="transcriptionContent && transcriptionContent.length > 0 ? transcriptionContent : 'Non renseignée'"
        />
      </div>
    </div>
    <div v-if="!preview">
      <document-notes
        :editable="editable"
        @add-place="addPlace($event, 'note')"
        @add-person="addPerson($event, 'note')"
        @add-note="addNote($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextEditor from "../forms/fields/RichTextEditor";
import EditorSaveButton from "../forms/fields/EditorSaveButton";
import DocumentNotes from "./DocumentNotes";
import escapeRegExp from "lodash/escapeRegExp";

export default {
  name: "DocumentTranscription",
  components: { EditorSaveButton, RichTextEditor, DocumentNotes },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["add-place", "add-person", "add-note"],
  data() {
    return {
      transcriptionContent: "",
      addressContent: "",
      editModeAddress: false,
      editModeTranscription: false
    };
  },

  computed: {
    ...mapState("document", ["document"]),
    ...mapState("search", ["searchTerm", "documents"])
  },
  mounted() {
    //console.log("this.documents.filter((doc) => doc.id == this.document.id)[0].transcription : ", this.documents.filter((doc) => doc.id == this.document.id)[0].transcription)
    console.log("preview status : ", this.preview)
    if (this.preview && this.documents.length > 0) {
      if (this.documents.filter((doc) => doc.id == this.document.id)[0].transcription !== undefined) {
        this.transcriptionContent = this.documents.filter((doc) => doc.id == this.document.id)[0].transcription.highlight/*.map(function (cc) {	return '<strong>' + cc + '</strong>';}).join('')*/ || "";
        console.log('type(this.transcriptionContent) : ', typeof(this.transcriptionContent))
        } else {
          this.transcriptionContent = this.document.transcription;
          console.log('default this.document.transcription')
        }
    } else {
      this.transcriptionContent = this.document.transcription || "";
      console.log('default this.document.transcription', this.document.transcription)
    }
    console.log('default this.document.address', this.document.address)
    this.addressContent = this.document.address || "";
  },
  methods: {
    addPlace(evt, source) {
      this.$emit("add-place", {...evt, source});
    },
    addPerson(evt, source) {
      this.$emit("add-person", {...evt, source});
    },
    addNote(evt) {
      console.log("transcription addNote(evt)", evt, {...evt})
      this.$emit("add-note", {...evt});
    },
    truncate(str, n, useWordBoundary) {
      if (str && str.length > 0) {
        if (str.length <= n) {
          return str;
        }
        const subString = str.slice(0, n - 1);
        return (useWordBoundary
            ? subString.slice(0, subString.lastIndexOf(" "))
            : subString) + " (...)";
      } else {
        return "Non renseignée"
      }
    },
    highlight(text) {
      const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const re = new RegExp(`(${terms.join("|")})`)
      return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
    },
    cancelAddressInput(evt) {
      console.log("address escape event ", { ...evt });
      this.enterEditModeAddress()
    },
    enterEditModeAddress() {
      this.editModeAddress = !this.editModeAddress;
      console.log("this.editModeAddress updated", this.editModeAddress);
    },
    cancelTranscriptionInput(evt) {
      this.enterEditModeTranscription();
    },
    enterEditModeTranscription() {
      this.editModeTranscription = !this.editModeTranscription;
      console.log("this.editModeTranscription updated", this.editModeTranscription)

    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_document.transcription.scss";

::v-deep em {
   background-color: yellow !important;
}
::v-deep .highlighted:after {
  content: " [...] ";
  font-weight: bold;
}
/*span.edit-btn {
  display: inline-block;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 24px auto no-repeat;
  i {display: none;
  }
}*/
.document__transcription--content {
  font-size: $font-size-text-tablet;

  @include on-mobile {
    font-size: $font-size-text-mobile;
  }
}
.edit-btn {
  position: unset;
  flex: 55px 0 0;

  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/icons/bouton_edit.svg) center / 20px auto no-repeat !important;
  cursor: pointer;

  @include on-mobile {
    flex: 45px 0 0;
  }

  .icon.icon__pen-edit {
    display: none;
  }
}
</style>
