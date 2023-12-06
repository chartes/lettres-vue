<template>
  <div class="">
    <div
      :class="['box', 'grid-container', { enabled: enabled }]"
      @click="toggleEnabled"
    >
      <div class="tag method">{{ method }}</div>
      <div class="example">
        <div class="description">{{ description }}</div>
        <div class="url">
          <a :href="url" target="_blank">{{ url }}</a>
        </div>
      </div>
      <div class="show">
        <span class="icon is-small is-pulled-right">
          <i :class="['fas', enabled ? 'fa-angle-up' : 'fa-angle-down']"></i>
        </span>
      </div>
      <div class="result" v-if="result && enabled">
        <pre>
          <code v-html="highlightCode(result, format ? format : 'json')">
  </code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import "highlight.js/styles/tomorrow.css";
import hljs from 'highlight.js';


export default {
  name: "ApiCallDropdown",
  props: ["url", "description", "method", "format"],
  data() {
    return {
      enabled: false,
      result: null,
    };
  },
  watch: {
    enabled: function (newValue) {
      if (this.result === null && newValue) {
        this.runApiCall();
      }
    },
  },
  methods: {
    toggleEnabled() {
      this.enabled = !this.enabled;
    },
    async runApiCall() {
      const res = await fetch(this.url, { method: this.method });
      //console.log("async runApiCall resp", res)
      this.result = await res.text();
      //console.log("async runApiCall this.result", this.result)
    },
    highlightCode(text, format) {
      if (text) {
        const highlightedCode = hljs.highlight(text,{ language: format }).value
        return highlightedCode;
      }
    },
  },
};
</script>
<style scoped>
.method {
  grid-area: method;

  font-weight: bold;
  font-size: large;
  text-transform: uppercase;
  color: whitesmoke;
  background-color: #555;

  margin-right: 40px;
  padding: 15px;
}
.example {
  grid-area: example;
}
.url {
  padding-top: 4px;
}
.box {
  margin-top: 10px;
  margin-bottom: 10px;
}
.box:hover {
  cursor: pointer;
  background-color: rgb(245, 245, 245);
}
.result {
  grid-area: code;

  margin-top: 12px;
  overflow: auto;
}
.show {
  grid-area: icon;
}
pre {
  white-space: pre-wrap;
  word-break: keep-all;
  padding: 0;
  background-color: white;
}
.grid-container {
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-template-rows: auto;
  grid-template-areas: "method example icon";

  align-items: center;
  word-break: break-all;
  padding: 16px;
}
.grid-container.enabled {
  grid-template-areas:
    "method example icon"
    "code code code";
}
</style>