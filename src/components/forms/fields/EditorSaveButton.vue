<template>
  <button
    class="argument__save button is-small"
    :class="saveButtonClass"
    :disabled="status === 'disabled'"
    @click="clickSave"
  >
    <component :is="saveButtonIcon" />
  </button>
</template>

<script>

  import IconSave from '../../ui/icons/IconSave';
  import IconError from '../../ui/icons/IconError';
  import IconSuccess from '../../ui/icons/IconSuccess';


  export default {
    name: "EditorSaveButton",
    props: {
      name: { type: String, required: true },
      value: { type: String, required: true },
      docId: { type: Number, required: true }
    },
    data() {
        return {
          status: 'normal',
          editorEnabled: true,
          form: ''
          }
      },

      computed: {
          saveButtonClass () {
              switch (this.status) {
                  case 'normal':
                  case 'disabled':
                      return 'is-success'
                  case 'success':
                      return 'is-success'
                  case 'error':
                      return 'is-danger'
                  case 'loading':
                      return 'is-loading'
                  default:
                      return 'is-danger'
              }
          },
          saveButtonIcon () {
              switch (this.status) {
                  case 'normal':
                  case 'loading':
                  case 'disabled':
                      return IconSave;
                  case 'success':
                      return IconSuccess;
                  case 'error':
                      return IconError;
                  default:
                      return IconError;
              }
          },
      },

      methods: {
          clickSave () {
              if (this.status === 'error' || this.status === 'success') return;
              this.status = 'loading';
              const attributes = {}
              attributes[this.name] = this.value && this.value.length > 0 ? this.value : null;
              const data = { id: this.docId, attributes };
              console.log('saves document ', data )
              this.$store.dispatch('document/save', data)
                  .then(response => {
                      this.status = 'success'
                      setTimeout(() => this.status = 'normal', 3000)
                  }).catch(() => {
                    this.status = 'error'
                     setTimeout(() => this.status = 'normal', 3000)
                })
          },
      },
  }
</script>
