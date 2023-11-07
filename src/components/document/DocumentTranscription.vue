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
        <div class="document__transcription--component is-flex">
          <span
            v-if="!preview && editable && !editModeAddress"
            class="edit-btn"
            @click="enterEditModeAddress"
          />
          <rich-text-editor
            v-if="editable && editModeAddress"
            v-model="addressContent"
            label="address"
            :formats="[['close'], ['italic', 'superscript'], ['person', 'location'], ['note']]"
            @add-place="addPlace($event, 'address')"
            @add-person="addPerson($event, 'address')"
            @add-note="addNote($event)"
            @refresh-address="refreshAddress($event)"
            @on-keyup-escape="cancelAddressInput($event)"
            @save="saveAddress()"
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
        <div class="document__transcription--component is-flex">
          <span
            v-if="!preview && editable && !editModeTranscription"
            class="edit-btn"
            @click="enterEditModeTranscription"
          />
          <rich-text-editor
            v-if="editable && editModeTranscription"
            v-model="transcriptionContent"
            label="transcription"
            :formats="[['close'], ['italic', 'superscript', 'page'], ['person', 'location'], ['note']]"
            @add-place="addPlace($event, 'transcription')"
            @add-person="addPerson($event, 'transcription')"
            @add-note="addNote($event)"
            @refresh-transcription="refreshTranscription($event)"
            @on-keyup-escape="cancelTranscriptionInput($event)"
            @save="saveTranscription()"
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
    </div>
    <!--<div v-if="!preview && transcriptionContent || !preview && addressContent">
      <document-notes
        :editable="editable"
        :title-editor="titleEditor"
        :transcription-editor="transcriptionEditor ? transcriptionEditor : transcriptionContent"
        :address-editor="addressEditor ? addressEditor : addressContent"
        @refresh-transcription="refreshTranscription($event)"
        @refresh-address="refreshAddress($event)"
        @refresh-title="refreshTitle($event)"
        @add-place="addPlace($event, 'note')"
        @add-person="addPerson($event, 'note')"
        @add-note="addNote($event)"
      /><span>{{ transcriptionEditor }}</span>
    </div>-->
  </div>
</template>

<script>
import { mapState } from "vuex";
import RichTextEditor from "../forms/fields/RichTextEditor";
import EditorSaveButton from "../forms/fields/EditorSaveButton";
import DocumentNotes from "./DocumentNotes";
import escapeRegExp from "lodash/escapeRegExp";
import {removeContentEditableAttributesFromString} from "@/modules/document-helpers";

export default {
  name: "DocumentTranscription",
  components: { EditorSaveButton, RichTextEditor },//, DocumentNotes
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    transcriptionEditor: {
      type: String,
      default: null,
    },
    addressEditor: {
      type: String,
      default: null,
    },
  },
  emits: ["add-place", "add-person", "add-note", "refresh-transcription", "refresh-address", "save-transcription", "save-address"],//"refresh-title",
  data() {
    return {
      transcriptionContent: "",
      addressContent: "",
      editModeAddress: false,
      editModeTranscription: false
    };
  },
  watch: {
    transcriptionEditor: function (newVal, Oldval) {
      console.log("DocumentTranscription / watch / transcriptionContent old new : ", Oldval, newVal)
      this.transcriptionContent = newVal;
      this.$emit("refresh-transcription", this.transcriptionContent)
    },
    addressEditor: function (newVal, Oldval) {
      console.log("DocumentTranscription / watch / addressContent old new : ", Oldval, newVal)
      this.addressContent = newVal;
      this.$emit("refresh-address", this.addressContent)
    }
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

      //TODO Victor remove once [note] have been replaced in database
      this.getNoteIndex(this.transcriptionContent, "transcription")
      this.getNoteIndex(this.addressContent, "address")

      //TODO Victor remove once attributes title have been added in database
      this.getPersonsLabel(this.transcriptionContent, "transcription");
      this.getPersonsLabel(this.addressContent, "address");

      //TODO Victor remove once attributes title have been added in database
      this.getPlacesLabel(this.transcriptionContent, "transcription");
      this.getPlacesLabel(this.addressContent, "address");
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
      if (evt === "test") {
        console.log("Launch transcription cleanup")
      } else {
        console.log("transcription addNote(evt)", evt, {...evt})
        this.$emit("add-note", {...evt});
      }
    },
    refreshTranscription(evt) {
      console.log("DocumentTranscription / refreshTranscription(evt)", evt);
      this.transcriptionContent = evt;
      this.$emit("refresh-transcription", evt)
    },
    saveTranscription() {
      this.$emit("save-transcription")
    },
    refreshAddress(evt) {
      console.log("DocumentTranscription / refreshAddress(evt)", evt);
      this.addressContent = evt;
      this.$emit("refresh-address", evt)
    },
    saveAddress() {
      this.$emit("save-address")
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
      // function called only if this.searchTerm && this.searchTerm.length > 0
      // split search terms (by space) if multiple
      // if (/^"".*""$/.test(text)) {TODO Victor : implement enclosed in quotes ?
      // previous rule : const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const terms = this.searchTerm.replaceAll(/^"|"$/g, "").split(new RegExp("[,;:.\\s+]+")).filter(term => term !== "")
      //let terms = this.searchTerm.replaceAll(/^"|"$/g, "").match(/\p{L}+|\d+/gu); // TODO Victor : does match "i568" works with .match(/\p{L}{2,}|\p{L}+\d+/gu)
      console.log('transcription text without quotes :', text)
      console.log('transcription terms without quotes :', terms)
      // Create regex with list of search terms and ensuring they are not searched within attributes (eg do not match/replace "a" in <a class=""...>
      if (terms && terms.length > 0) {
        // include word boundaries to exclude matching characters within a word, e.g. search and match "de" in "deuxième"
        let regexTerms = [];
        for (let i = 0, len = terms.length; i < len; i++) {
          regexTerms.push("\\b" + terms[i] + "\\b");
        }
        if (text.includes('<p>')) {
          // if source is pseudo HTML (has tags) it is necessary to add a lookahead
          let re = new RegExp(`(?:(?!\\w)|\\b(?=\\w))(${terms.join("|")})(?:(?<=\\w)\\b|(?<!\\w))(?=[^<>]*<)`);
          console.log("transcription match re :", re)
          return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
        } else {
          // if source is text, no need for positive lookahead otherwise they will not match
          let re = new RegExp(`(${regexTerms.join("|")})`);
          console.log("transcription match re :", re)
          return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
        }
      //const re = new RegExp(`(${terms.join("|")})(?=[^<>]*<)`)
      } else {
        return text
      }
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
    },
    //TODO Victor remove once [note] have been replaced in database
    getNoteIndex(content, type) {
      const pattern = /<a class="note" href="#(\d+)">\[note]<\/a>/gmi
      console.log("DocumentTranscription / getNoteIndex", content, type)
      if (content) {
        this.contentPrep = content
        //console.log(`DocumentTranscription / getNoteIndex / this.${type}Prep : `, this.contentPrep)
        let inContent = pattern.test(this.contentPrep);
        console.log(`in${type}`, inContent)
        if (inContent) {
          console.log(`in${type}`, this.contentPrep)
          let contentMatch = content.match(pattern)
          //console.log(`${type}Match`, contentMatch)
          let contentMatches = [...content.matchAll(pattern)]
          //console.log(`${type}Matches`, contentMatches)
          let DocumentsNotes = this.$store.state.document.notes
          let contentMatcheswithIndex = []
          //console.log("DocumentsNotes", DocumentsNotes)
          contentMatches.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], DocumentsNotes.findIndex(n => n.id === parseInt(m[1])) + 1)
            m.push(String(DocumentsNotes.findIndex(n => n.id === parseInt(m[1])) + 1))
            contentMatcheswithIndex.push(m)
            //console.log(`${type}withIndex`, contentMatcheswithIndex)
          })
          contentMatcheswithIndex.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], typeof (m[1]))
            //console.log("m[0].replace('[note]', '['+ m[2] +']')", m[0].replace('[note]', '[' + m[2] + ']'))
            if (type === "transcription") {
              this.transcriptionContent = this.transcriptionContent.replace(m[0], m[0].replace('[note]', '[' + m[2] + ']'));
            } else {
              this.addressContent = this.addressContent.replace(m[0], m[0].replace('[note]', '[' + m[2] + ']'));
            }
          })
          console.log(`in${type} replaced`, type === "transcription" ? this.transcriptionContent : this.addressContent)
        }
      }
    },
    //TODO Victor remove once attributes title have been added in database
    async getPersonsLabel(content, type) {
      const persPattern = /<a class="persName" target="_blank" href="[^>]*" id="(\d+)">[^<]*<\/a>/gmi
      console.log("DocumentTranscription / getPersonsLabel", content, type)
      if (content) {
        this.contentPrep = content
        //console.log(`DocumentTranscription / getNoteIndex / this.${type}Prep : `, this.contentPrep)
        let inContent = persPattern.test(this.contentPrep);
        console.log(`getPersonsLabel in${type}`, inContent)
        if (inContent) {
          console.log(`getPersonsLabel in${type}`, this.contentPrep)
          let contentMatch = content.match(persPattern)
          console.log(`getPersonsLabel ${type}Match`, contentMatch)
          let contentMatches = [...content.matchAll(persPattern)]
          console.log(`getPersonsLabel ${type}Matches`, contentMatches)
          let contentMatcheswithLabel = []
          await Promise.all(contentMatches.map(async (m) => {
            await this.$store.dispatch("persons/getPersonById", parseInt(m[1])).then(
                (response) => {
                  console.log("m[0], m[1], response.attributes.label", m[0], m[1], response.attributes.label)
                  m.push(response.attributes.label)
                  contentMatcheswithLabel.push(m)
                }
            )
            console.log(`${type}withTitle`, contentMatcheswithLabel)
          }))
          contentMatcheswithLabel.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], typeof (m[1]))
            console.log("m[0].replace('target=\"_blank\"', 'target=\"_blank\"' + ' title=\"' + m[2] + '\"')", m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'))
            if (type === "transcription") {
              this.transcriptionContent = this.transcriptionContent.replace(m[0], m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'));
            } else {
              this.addressContent = this.addressContent.replace(m[0], m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'));
            }
          })
          console.log(`getPersonsLabel in${type} replaced`, type === "transcription" ? this.transcriptionContent : this.addressContent)
        }
      }
    },
    //TODO Victor remove once attributes title have been added in database
    async getPlacesLabel(content, type) {
      const placePattern = /<a class="placeName" target="_blank" href="[^>]*" id="(\d+)">[^<]*<\/a>/gmi
      console.log("DocumentTranscription / getPlacesLabel", content, type)
      if (content) {
        this.contentPrep = content
        //console.log(`DocumentTranscription / getNoteIndex / this.${type}Prep : `, this.contentPrep)
        let inContent = placePattern.test(this.contentPrep);
        console.log(`getPlacesLabel in${type}`, inContent)
        if (inContent) {
          console.log(`getPlacesLabel in${type}`, this.contentPrep)
          let contentMatch = content.match(placePattern)
          console.log(`getPlacesLabel ${type}Match`, contentMatch)
          let contentMatches = [...content.matchAll(placePattern)]
          console.log(`getPlacesLabel ${type}Matches`, contentMatches)
          let contentMatcheswithLabel = []
          await Promise.all(contentMatches.map(async (m) => {
            await this.$store.dispatch("placenames/getPlacenameById", parseInt(m[1])).then(
                (response) => {
                  console.log("m[0], m[1], response.attributes.label", m[0], m[1], response.attributes.label)
                  m.push(response.attributes.label)
                  contentMatcheswithLabel.push(m)
                }
            )
            console.log(`${type}withTitle`, contentMatcheswithLabel)
          }))
          contentMatcheswithLabel.forEach(m => {
            //console.log("m[0], m[1]", m[0], m[1], typeof (m[1]))
            console.log("m[0].replace('target=\"_blank\"', 'target=\"_blank\"' + ' title=\"' + m[2] + '\"')", m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'))
            if (type === "transcription") {
              this.transcriptionContent = this.transcriptionContent.replace(m[0], m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'));
            } else {
              this.addressContent = this.addressContent.replace(m[0], m[0].replace('target="_blank"', 'target="_blank"' + ' title="' + m[2] + '"'));
            }
          })
          console.log(`getPlacesLabel in${type} replaced`, type === "transcription" ? this.transcriptionContent : this.addressContent)
        }
      }
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
  /*content: " [...]\A";
  white-space: pre-wrap;*/

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
