<template>
  <div
    v-show="viewer"
    :id="`vue-mirador-container-${windowId}`"
    class="vue-mirador-container"
    @refresh-viewer="updateCurrentWindow"
  />
</template>

<script>
import Mirador from "mirador";
import {mapActions, mapState} from "vuex";
import axios from "axios";

export default {
  name: "MiradorViewer",
  components: {},
  props: {
    manifestUrl: { type: String, required: true },
    //canvasIndex: { type: Number, default: 0 },
    windowId: {type: String, default: "document"}
  },
  data() {
    return {
      viewer: null,
      defaultManifestUrl: null
    };
  },
  computed: {
    ...mapState("document", ["witnesses"]),
    ...mapState("layout", ["canvasIndex", "viewerMode"]),
  },
  watch: {
    manifestUrl() {
      this.setManifestUrl(this.manifestUrl);
    },
    canvasIndex() {
      //console.log("mirador watch canvasIndex", this.canvasIndex)
      this.setCanvasId(this.canvasIndex)
    },
    viewerMode() {
      //this.setCanvasId(this.canvasIndex)
    }
  },
  async created() {
    this.$parent.$on("refresh-viewer", await this.updateCurrentWindow);
  },
  async mounted() {
    this.defaultManifestUrl = this.witnesses[0]["manifest_url"] ? this.witnesses[0]["manifest_url"] : null;
    await this.initialize();
  },
  methods: {
    ...mapActions("layout", ["setViewerMode", "setCanvasIndex"]),
    async initialize() {
      if (this.viewerMode === "text-mode" || !this.viewerMode) {
        this.setViewerMode("text-and-images-mode");
      }

      const manifests = {};
      let url = this.manifestUrl;
      try {
        //const collection = await axios.get(this.manifestUrl);
        // waiting for mirador 3 support of collections ?
        //url = collection.data.manifests[0]["@id"];
      } catch (e) {
        console.error(e);
      }

      manifests[url] = {
        // metadata:
        // 'provider': ''
      };
      const resp = await axios.get(this.manifestUrl);
        let canvasId = resp.data.sequences[0]["canvases"][this.canvasIndex]["@id"];

      try {
        this.viewer = Mirador.viewer({
          id: `vue-mirador-container-${this.windowId}`,
          manifests: manifests,
          windows: [
            {
              id: this.windowId,
              loadedManifest: url,
              canvasId: canvasId,
            },
          ],
          window: {
            allowClose: false,
            allowMaximize: false,
            defaultSideBarPanel: "info",
            sideBarOpenByDefault: false,
            hideWindowTitle: true,
            maximizedByDefault: true
          },
          workspace: {
            showZoomControls: true,
            type: "mosaic", // Which workspace type to load by default. Other possible values are "elastic"
          },
          workspaceControlPanel: {
            enabled: false,
          },
        });
      } catch (e) {
        console.warn("Mirador viewer: ", e);
      } this.setCanvasId(this.canvasIndex)
    },
    async dispatchAction(action) {
      if (this.viewer === null) {
        //console.log("dispatchAction", this.viewer, this.windowId)
        await this.initialize();
      }
      this.viewer.store.dispatch(action);
    },

    setManifestUrl(newUrl) {
      //console.log("setManifestUrl", newUrl);
      const action = Mirador.actions.updateWindow(this.windowId, {
        manifestId: this.manifestUrl,
      });
      this.dispatchAction(action);
    },

    async setCanvasId(canvasIndex) {
      //console.log("setCanvasId", canvasIndex)
      //console.log("this.manifestUrl", this.manifestUrl)
      const resp = await axios.get(this.manifestUrl);
      let canvasId = resp.data.sequences[0]["canvases"][canvasIndex]["@id"];
      const action = Mirador.actions.setCanvas(this.windowId, canvasId);
      if (this.viewerMode === "text-mode" || !this.viewerMode) {
        this.setViewerMode("text-and-images-mode");
      }
      this.dispatchAction(action);
    },

    updateCurrentWindow() {
      console.log("refresh-viewer caught by mirador viewer");
      this.setManifestUrl(this.manifestUrl);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";

.vue-mirador-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.mosaic-root {
  top: 0 !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
}
.mosaic-tile {
  margin: 0 !important;
}
.Connect\(WithPlugins\(WindowTopBar\)\)-windowTopBarStyle-16.Connect\(WithPlugins\(WindowTopBar\)\)-focused-15 {
  border-top: none !important;
}
</style>
