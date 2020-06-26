<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <b-skeleton
          width="128px"
          height="170px"
        />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <b-skeleton
            active
            width="40%"
          />
          <b-skeleton height="120px" />
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "DocumentPreviewCardSkeleton",
  props: {},
  data() {
    return {
      
    };
  },
  computed: {

  },
 
  created() {
    
  },
  methods: {
   
  }
};
</script>

<style scoped lang="scss">
figure {
  margin-right: 100px;
}
.content {
  height: 180px;
  margin-bottom: 40px;
}
</style>
