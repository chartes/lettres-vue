<template>
  <li class="witness-item">
    <div class="witness-item__content">
      <span
        class="witness-item__text"
        v-html="me.content"
      />
      <span
        v-if="me.status && me.status.length > 0"
        class="tag"
      >{{ me.status }}</span>
      <span
        v-if="me.tradition && me.tradition.length > 0"
        class="tag"
      >{{ me.tradition }}</span>
      <span
        v-if="me.institution"
        class="tag"
      >{{ me.institution.name }}</span>
      <span v-if="editable">
        <a
          v-if=" listLength > 1"
          @click="reorderAction(me, 1)"
        >
          <icon-arrow-down style="padding: 0" />
        </a>
        <a
          v-if="listLength > 1 && listIndex > 0"
          @click="reorderAction(me, -1)"
        >
          <icon-arrow-down
            style="padding: 0"
            class="is-upside-down"
          />
        </a>
        <a
          class="witness-item__edit"
          @click="editAction(me)"
        >
          <icon-pen-edit />
        </a>
        <!--
        <a
          :href="editManifest"
          target="_blank"
        >
          <img
            src="/lettres/static/images/logo-iiif-34x30.png"
            class="witness-item__iiif-logo"
          >
        </a>
        -->
        <a
          v-if="canBeRemoved"
          class="witness-item__delete"
          @click="deleteAction(me)"
        >
          <icon-bin />
        </a>
      </span>
    </div>
  </li>
</template>

<script>
  import IconPenEdit from '../../ui/icons/IconPenEdit'
  import IconBin from '../../ui/icons/IconBin'
  import IconArrowDown from '../../ui/icons/IconArrowDown'

  export default {
    name: 'WitnessItem',
    components: {IconArrowDown, IconBin, IconPenEdit},
    props: {
      editable: { type: Boolean, default: false },
      canBeRemoved: {type: Boolean, default: true},
      listIndex: { type: Number, default: 0 },
      listLength: { type: Number, default: 0 },
      witness: { type: Object, default: () => { return {} } },
      editAction: { type: Function },
      reorderAction: { type: Function },
      deleteAction: { type: Function }
    },
    data () {
      return {
        me: {...this.$props.witness}
      }
    },
    computed: {
        editManifest() {
            return `/lettres/iiif/editor/witnesses/${this.me.id}`;
        }
    },
    watch: {
      witness (newValue) {
        this.me = {...newValue}
      }
    },
    mounted () {
      this.$store.dispatch('document/fetchWitnessInstitution', this.me.id)
    }
  }
</script>

<style scoped>

</style>
