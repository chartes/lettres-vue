<template>
  <div>
    <div>
      <Locks />
    </div>
    <div>
      <span class="pagination-goto">
        <span> Page : </span>
        <input
          v-model="currentPage"
          name="page"
          class="input"
          type="text"
          placeholder="Page..."
          @change.prevent="currentPage = parseInt(p)"
        >
      </span>
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

        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
        backend-filtering
        @filters-change="onFilter"
        @page-change="onPageChange"
      >
        <!-- backend-sorting :total="totalCount" @sort="onSort" -->
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>Vous n'avez aucun verrouillage pour le moment.</p>
            </div>
          </section>
        </template>
        <template #detail="props">
          <document
            class="document-page"
            :doc-id="props.row.attributes['object-id']"
            :preview="true"
          />
        </template>
        <b-table-column
          v-slot="props"
          field="object-id"
          label="Lettre"
          width="10%"
          sortable
          numeric
          searchable
        >
          <document-tag-bar
            :key="props.row.docId"
            :doc-id="props.row.docId"
            :with-status="false"
          />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="user-id"
          label="User Id"
          width="20%"
          centered
          sortable
          numeric
          searchable
        >
          <span v-html="props.row.userId" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="userName"
          label="User name"
          width="10%"
          searchable
        >
          <span v-html="props.row.userName" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="description"
          label="Description"
          width="40%"
          sortable
          searchable
        >
          <span v-html="props.row.attributes.description" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="event-date"
          label="Date"
          width="40%"
          sortable
          searchable
        >
          <span v-html="new Date(props.row.attributes['event-date']).toLocaleDateString()" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="expiration-date"
          label="Expire"
          width="40%"
          sortable
        >
          <span v-html="props.row.attributes['expiration-date']" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="status"
          label="Active"
          width="20%"
          centered
        >
          <span v-html="props.row.attributes['is-active']" />
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTagBar from "@/components/document/DocumentTagBar";
import Locks from "@/components/sections/Locks.vue";
import Document from "@/components/sections/Document.vue";

export default {
  name: "LocksPage",
  components: {
    Document,
    Locks,
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
              userId: l.user.id,
              attributes: l.data.attributes,
              userName: l.user.username,
            };
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
.pagination-goto {
  display: flex;
  float: right;
  position: relative;
  width: 120px;
  margin-left: 50px;
  span {
    width: 100px;
    align-self: center;
  }
  input {
    margin-left: 4px;
    display: inline;
  }
}
</style>