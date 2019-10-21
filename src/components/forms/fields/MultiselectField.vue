<template>
  <div class="field field-multiselect">
    <field-label
      :label="label"
      :add-colons="addColons"
    />
    <div class="field selected-list is-grouped is-grouped-multiline">
      <div
        v-for="item in items"
        :key="item[optionIdField]"
        class="control"
      >
        <div class="tags has-addons selected-item are-medium">
          <span class="tag">{{ item[optionLabelField] }}</span>
          <a
            v-if="editable"
            class="tag is-delete"
            @click.prevent="deleteItem(item[optionIdField])"
          />
        </div>
      </div>


      <div
        v-if="editable && optionsList.length > ids.length"
        v-click-outside="hideList"
        class="control field-multiselect__actions"
      >
        <a
          class="tag"
          href="#"
          @click.prevent="displayList"
        >
          <icon-add />
        </a>
        <ul
          v-if="listVisible"
          class="field-multiselect__options box"
        >
          <li
            v-for="option in optionsNotSelected"
            :key="option[optionIdField]"
          >
            <a
              href="#"
              class="unselected-item"
              @click.prevent="addItem(option)"
              v-html="option[optionLabelField]"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  import ClickOutside from 'vue-click-outside';
  import FieldLabel from './FieldLabel';
  import IconAdd from '../../ui/icons/IconAdd';

  export default {
    name: "MultiselectField",
    components: {IconAdd, FieldLabel},
    directives: {
      ClickOutside
    },
    props: {
      editable: {
        type: Boolean, default: false
      },
      label: {
        type: String
      },
      selectedItems: {
        type: Array,
      },
      optionLabelField: {
        type: String, default: 'label'
      },
      optionIdField: {
        type: String, default: 'id'
      },
      optionsList: {
        type: Array
      },
      onChange: {
        type: Function, required: true
      },
      addColons: {
          type: Boolean, default: true
      }
    },
    data () {
      return { listVisible: false, items: [], ids: []}
    },
    computed: {

      optionsNotSelected () {
        if (!this.optionsList) return [];
        return this.optionsList.filter(op => !this.ids.includes(op[this.optionIdField]));
      }
    },
    watch: {
      selectedItems () {
        this.updateAllItems();
      }
    },
    mounted () {
      this.updateAllItems();
    },
    methods: {
      addItem (item) {
        this.items.push(item);
        this.ids.push(item[this.optionIdField]);
        this.hideList();
        this.onChange(this.items);
      },
      deleteItem (itemId) {
        this.items = this.items.filter (it => it[this.optionIdField] !== itemId);
        this.ids = this.items.map (it => it[this.optionIdField]);
        this.onChange(this.items);
      },
      updateAllItems () {
        if (!this.selectedItems) return;
        this.items = this.selectedItems.map (it => ({...it}));
        this.ids = this.items.map (it => it[this.optionIdField]);
      },
      displayList () {
        this.listVisible = true;
      },
      hideList () {
        this.listVisible = false;
      }
    }
  }
</script>

<style scoped>

</style>
