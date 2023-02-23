<template>
  <div>
    <div>
      <b-table
        ref="multiSortTable"
        :data="data"
        detailed
        detail-key="docId"
        show-detail-icon

        striped
        :loading="isLoading"

        paginated
        backend-pagination
        :per-page="pageSize"
        :current-page.sync="currentPage"
        pagination-position="both"
        :page-input="true"
        page-input-position="is-input-left"
        aria-next-label="Page suivante"
        aria-previous-label="Page précédente"
        aria-page-label="Page"
        aria-current-label="Page courante"
        :total="totalCount"
        sort-icon="menu-up"
        sort-icon-size="is-medium"
        :backend-sorting="true"
        :sort-multiple="true"
        :sort-multiple-data="sortingPriority"

        checkable
        checkbox-position="right"

        backend-filtering
        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
        @filters-change="onFilter"
        @page-change="onPageChange"
      >
        <!-- backend-sorting :total="totalCount" @sort="onSort" -->
        <template #top-left>
          <span class="table_title">Status des verrouillages</span>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>Vous n'avez aucun verrouillage pour le moment.</p>
            </div>
          </section>
        </template>
        <!--<template #detail="props">
          <document
            class="document-page"
            :doc-id="props.row.docId"
            :preview="true"
          />
        </template>-->
        <b-table-column
          v-slot="props"
          field="object-id"
          label="Lettre"
          width="20%"
          sortable
          numeric
          searchable
        >
          <document-tag-bar
            :key="props.row.docId"
            :doc-id="props.row.docId"
            :with-status="true"
          />
        </b-table-column>
        <b-table-column
          field="userName"
          label="User name"
          width="10%"
          searchable
        >
          <!--<span v-html="props.row.items.userName" />-->
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
          width="40%"
          sortable
          searchable
        >
          <!--<span v-html="props.row.items.attributes.description" />-->
        </b-table-column>
        <b-table-column
          field="event-date"
          label="Date"
          width="15%"
          sortable
          searchable
        >
          <!--<span class="tag" v-html="new Date(props.row.items.attributes['event-date']).toLocaleDateString()" />-->
        </b-table-column>
        <b-table-column
          field="expiration-date"
          label="Expire"
          width="15%"
          sortable
          searchable
        >
          <!--<span
            v-if="props.row.items.attributes['is-active']"
            class="tag is-success"
            v-html="new Date(props.row.items.attributes['expiration-date']).toLocaleDateString()"
          />
          <span
            v-else
            class="tag is-warning"
            v-html="new Date(props.row.items.attributes['expiration-date']).toLocaleDateString()"
          />-->
        </b-table-column>
        <template #detail="props">
                <tr v-for="item in props.row.items" :key="item.userName">
                    <td>{{ item.userName }}</td>
                    <!--<td>{{ item.attributes.description }}</td>
                    <td>{{ item.attributes['event-date'] }}</td>
                    <td>
                        <span
            v-if="item.attributes['is-active']"
            class="tag is-success"
            v-html="new Date(item.attributes['expiration-date']).toLocaleDateString()"
          />
          <span
            v-else
            class="tag is-warning"
            v-html="new Date(item.attributes['expiration-date']).toLocaleDateString()"
          />
                    </td>-->
                </tr>
            </template>
      </b-table>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTagBar from "@/components/document/DocumentTagBar";
import Document from "@/components/sections/Document.vue";
import {left} from "core-js/internals/array-reduce";

export default {
  name: "LocksPage",
  components: {
    //Document,
    DocumentTagBar,
  },
  data() {
    return {
      fetchedData: [],
      data: [],
      sortingPriority: [{ field: "expiration-date", order: "desc" }],
      filters: [],
      numPage: 1,
      pageSize: 25,
      totalCount: 0,
      isLoading: false,
    };
  },
  computed: {
    currentPage: {
      get: function () {
        return this.numPage;
      },
      set: async function (newValue, oldValue) {
        newValue = parseInt(newValue);
        if (newValue && newValue !== oldValue) {
          this.numPage = newValue;
          await this.loadAsyncData();
        }
      },
    },
    ...mapState("user", ["current_user", "jwt"]),
    ...mapState("locks", ["fullLocks"]),
    ...mapGetters("document", []),
  },
  /*watch: {
    async fullLocks() {
      this.data = await Promise.all(
          this.fullLocks.map(async (b) => {
            return {
              docId: b.data.attributes['object-id'],
              userId: b.user.id,
              attributes: b.data.attributes,
              userName: b.user.username,

            };
          })
      )
      console.log('this.data : ', this.data);
    },
  },*/
  async created() {
    await this.fetchData();
  },
  methods: {
    toggle(row) {
                this.$refs.table.toggleDetails(row)
            },
    ...mapActions("locks", ["fetchFullLocks"]),
    async fetchData() {
      this.isLoading = true;
      let myfilters = [];
      if (this.filters) {
        for (let i = 0; i < Object.keys(this.filters).length; i++) {
          myfilters.push('filter['+Object.keys(this.filters)[i]+']='+Object.values(this.filters)[i]);
        }
      }
      console.log('myfilters : ',myfilters.join('&'))
      this.fetchedData = await this.fetchFullLocks({
        userId: this.current_user.id,
        sortingPriority: this.sortingPriority,
        numPage: this.numPage,
        pageSize: this.pageSize,
        filters: myfilters,
      });
      console.log('async fetchData() / this.fetchedData : ', this.fetchedData)
      this.loadAsyncData();
      this.isLoading = false;
    },
    /* Handle sort event

            onSort(field, order) {
                this.sortField = field
                this.sortOrder = order
                this.sortingPriorityRemoved(field)
            },
    */
    async resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        await this.fetchData();
      }
    },
    async onFilter(filters){
      console.log("filters : ", filters);
      if (filters) {
        this.filters = Object.entries(filters).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {});
        await this.fetchData();
        /*let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        console.log('existingPriority', existingPriority);
        if (existingPriority) {
          existingPriority.order = existingPriority.order === "desc" ? "asc" : "desc";
          this.sortingPriority[this.sortingPriority.findIndex(sp => sp.field === existingPriority.field)] = existingPriority;
          //this.sortingPriority.push({ field, order });
          console.log('sortingPriority', this.sortingPriority);
        } else {
          // request sorted data from backend
          console.log('change order', field, order );
          this.sortingPriority.push({ field, order });
        }
        await this.fetchData();
        //this.currentPage = 1;
      } else {
        // request regular sorted data from backend
        console.log('no change order', field, order );
        this.sortingPriority = []; // [{field, order}]
        this.currentPage = 1;*/
      }
    },
    // Backend sorting
    async sortingPriorityRemoved(field) {
      console.log('sortingPriorityRemoved');
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      console.log(newPriority, this.sortingPriority);
      await this.fetchData();
    },

    async sortPressed(field, order, event) {
      console.log('field, order, event', field, order, event);
      if ((this.customKey && event[this.customKey]) || !this.customKey) {
        console.log('condition', (this.customKey && event[this.customKey]) || !this.customKey);
        let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        console.log('existingPriority', existingPriority);
        if (existingPriority) {
          existingPriority.order = existingPriority.order === "desc" ? "asc" : "desc";
          this.sortingPriority[this.sortingPriority.findIndex(sp => sp.field === existingPriority.field)] = existingPriority;
          //this.sortingPriority.push({ field, order });
          console.log('sortingPriority', this.sortingPriority);
        } else {
          // request sorted data from backend
          console.log('change order', field, order );
          this.sortingPriority.push({ field, order });
        }
        await this.fetchData();
        //this.currentPage = 1;
      } else {
        // request regular sorted data from backend
        console.log('no change order', field, order );
        this.sortingPriority = []; // [{field, order}]
        this.currentPage = 1;
      }
      // will reload the data
      //this.currentPage = 1;
    },

    loadAsyncData() {
      if (this.fetchedData) {
        console.log('loadAsyncData() / this.fetchedData : ', this.fetchedData)
        this.totalCount = this.fetchedData.totalCount;
        this.data = this.fetchedData.locks.map((l) => {
            return {
              docId: l.data.attributes['object-id'],
              items:  {
                userId: l.user.id,
                attributes: l.data.attributes,
                userName: l.user.username,
            }};
          })
        console.log('loadAsyncData() / this.data : ', this.data);
      }
    },
    /*
     * Handle page-change event
     */
    onPageChange(page) {
      console.log("tada")
      this.currentPage = page;
    },


    /*
     * Load async data
     */
    /*loadAsyncData() {
      this.fetchFullLocks({
        userId: this.current_user.id,
        pageId: this.page,
        pageSize: this.perPage,
        filters: "",
      });
    },*/
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.table_title {
  margin-bottom: 25px;
  font-family: $family-primary;
  font-size: 20px;
  font-weight: 500;
  color: #C00055;
}
</style>