<template>
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p class="mb-5">
          <b-skeleton
            active
            width="50%"
            height="32px"
          />
        </p>
        <div
          class="level mb-5"
          style="width: 100%"
        >
          <div
            class="level-left"
            style="width: 100%"
          >
            <span
              class="level-item"
              style="width: 30%"
            >
              <b-skeleton
                active
                height="50px"
              /> 
            </span>
            <span
              class="level-item"
              style="width: 30%"
            >
              <b-skeleton
                active
                height="50px"
              />
            </span>
          </div>
        </div>
        <p>
          <b-skeleton height="150px" />
          <b-skeleton height="150px" />
          <b-skeleton height="320px" />
          <b-skeleton height="60px" />
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "DocumentSkeleton",
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
.content {
  height: 600px;
  margin-bottom: 40px;
}
</style>
