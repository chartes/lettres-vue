<template>
  <span
    class="badge"
    :class="myclasses"
    @click="toggle"
  >
    <span v-if="isActive">
      <slot
        id="active"
        name="active"
      />
      <label for="active"><slot name="activeLabel" /></label>
    </span>
    <span v-else>
      <slot
        id="inactive"
        name="inactive"
      />
      <label for="inactive"><slot name="inactiveLabel" /></label>
    </span>
  </span>
</template>

<script>
  export default {
    name: "Badge",
    props: {
        classesActive: {},
        classesInactive: {},
        actionWhenOn: {type: Function},
        actionWhenOff: {type: Function},
        startsOn: {default: false}
    },
    data() {
        return {
          isActive : this.startsOn
        }
    },
    computed: {
        myclasses() {return this.isActive ? this.classesActive: this.classesInactive},
    },
    watch: {
        startsOn: function(){
            this.isActive = this.startsOn;
        }
    },
    created(){
    },
    methods: {
        toggle() {
           if (this.isActive) {
               if (!this.actionWhenOff) {
                   this.isActive = false;
                   return
               }
               this.actionWhenOff().then(resp => {
                   this.isActive = resp;
               }).catch(resp => {
                   console.warn(resp);
               });
           } else {
               if (!this.actionWhenOn) {
                   this.isActive = true;
                   return
               }
               this.actionWhenOn().then(resp => {
                   this.isActive = resp;
               }).catch(resp => {
                   console.warn(resp);
               });
           }
        }
    }
  }
</script>

<style scoped>
    .badge:hover, label:hover {
        cursor: pointer;
    }
</style>