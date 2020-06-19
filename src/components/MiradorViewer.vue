<template>
  <div
    v-show="viewer"
    id="vue-mirador-container"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Mirador from 'mirador'

export default {
  name: 'MiradorViewer',
  components: {},
  props: {
    manifestUrl: { type: String, required: true },
    canvasIndex: { type: Number, default: 0 }
  },
  data () {
    return {
      viewer: null
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
    const manifests = {}
    manifests[this.manifestUrl] = {
      // metadata:
      // 'provider': ''
    }
    // instantiate the viewer with a single manifest & window for simplicity
    try {
      this.viewer = Mirador.viewer({
        'id': 'vue-mirador-container',
        'manifests': manifests,
        'windows': [
          {
            'loadedManifest': this.manifestUrl,
            'canvasIndex': this.canvasIndex
          }
        ],
        'window': {
          'allowClose': false,
          'allowMaximize': false,
          'defaultSideBarPanel': 'info',
          'sideBarOpenByDefault': false,
          'maximizedByDefault': true
        },
        'workspaceControlPanel': {
          'enabled': false
        }
      })
    } catch (e) {
      console.warn('Mirrador viewer: ', e)
    }
  },
  methods: {
  }
}
</script>

<style>
  #vue-mirador-container {
    min-height: calc(100vh - 56px);
    position: relative;
  }
  .mosaic-root {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .mosaic-tile {
    margin: 0px;
  }
  .Connect\(WithPlugins\(WindowTopBar\)\)-windowTopBarStyle-16.Connect\(WithPlugins\(WindowTopBar\)\)-focused-15 {
    border-top: none;
  }
</style>
