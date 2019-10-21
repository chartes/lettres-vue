<template>
  <div>
    <div
      v-if="topWidget && end > 1"
      class="container pagination buttons are-normal"
    >
      <span
        class="icon pagination__button button"
        @click="performAction(start)"
      >
        <v-icon small>$vuetify.icons.firststep</v-icon>
      </span>
      <span
        class="icon pagination__button button"
        @click="performAction(currentPage-1)"
      >
        <v-icon small>$vuetify.icons.previousstep</v-icon>
      </span>
      <span class="pagination__button__input-box">
        <input
          v-model="currentPage"
          class="input"
          style="width: 60px; height: 24px"
          @change="performAction(currentPage)"
        >
        <span>/ {{ end }}</span>
      </span>
      <span
        class="icon pagination__button button"
        @click="performAction(currentPage+1)"
      >
        <v-icon small>$vuetify.icons.nextstep</v-icon>
      </span>
      <span
        class="icon pagination__button button"
        @click="performAction(end)"
      >
        <v-icon small>$vuetify.icons.laststep</v-icon>
      </span>
    </div>
    <slot />
    <div
      v-if="bottomWidget && end > 1"
      class="container pagination buttons are-normal"
    >
      <span
        class="icon pagination__button button"
        @click="performAction(start)"
      >
        <v-icon small>$vuetify.icons.firststep</v-icon>
      </span>
      <span
        class="icon pagination__button button"
        @click="performAction(currentPage-1)"
      >
        <v-icon small>$vuetify.icons.previousstep</v-icon>
      </span>
      <span class="pagination__button__input-box">
        <input
          v-model="currentPage"
          class="input"
          style="width: 60px; height: 24px"
          @change="performAction(currentPage)"
        >
        <span>/ {{ end }}</span>
      </span>
      <span
        class="icon pagination__button button"
        @click="performAction(currentPage+1)"
      >
        <v-icon small>$vuetify.icons.nextstep</v-icon>
      </span>
      <span
        class="icon pagination__button button"
        @click="performAction(end)"
      >
        <v-icon small>$vuetify.icons.laststep</v-icon>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
        start: {default: 1, type: Number},
        current: { required: true, default: 1},
        end: { required: true, type: Number },
        action: { required: true, type: Function},

        topWidget: {default: true},
        bottomWidget: {default: true}
    },
    data () {
      return {
        currentPage : parseInt(this.current)
      }
    },
    computed: {

    },
    watch: {
        current: function() {
           this.performAction(this.current);
        }
    }  ,
    created() {

    },
    methods: {
       performAction(num) {
          if (!parseInt(num)) {
              num = 1;
          }
          if (num > this.end) {
              num = this.end;
          } else if (num < this.start) {
              num = this.start;
          }
          this.currentPage = num;
          this.action(this.currentPage);
       },
    }
  }
</script>

<style scoped>
    .pagination {
        width: unset;
    }
    .pagination, .icon, input {
       justify-content: center;
       color: #4a4a4a;
    }
    .pagination__button__input-box {
        margin-right: 10px;
    }
    .pagination__button {
        min-width: 28px;
        margin-bottom: 0px;
    }
    .pagination__button:hover {
        background: #962D3E;
        color: white;
    }

</style>
