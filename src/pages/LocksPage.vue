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
        @details-open="(row, index) => $buefy.toast.open(`Expanded ${row.docId}`)"
      >
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
        <template #detail="props">
          <document
            class="document-page"
            :doc-id="props.row.docId"
            :preview="true"
          />
        </template>
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
          v-slot="props"
          field="userName"
          label="User name"
          width="10%"
          searchable
        >
          <span v-html="props.row.username" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="description"
          label="Description"
          width="40%"
          sortable
          searchable
        >
          <span v-html="props.row.description" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="event-date"
          label="Date"
          width="15%"
          sortable
          searchable
        >
          <span class="tag" v-html="new Date(props.row.event_date).toLocaleDateString()" />
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="expiration-date"
          label="Expire"
          width="15%"
          sortable
          searchable
        >
          <span
            v-if="props.row.is_active"
            class="tag is-success"
            v-html="new Date(props.row.expiration_date).toLocaleDateString()"
          />
          <span
            v-else
            class="tag is-warning"
            v-html="new Date(props.row.expiration_date).toLocaleDateString()"
          />
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTagBar from "@/components/document/DocumentTagBar";
import Document from "@/components/sections/Document.vue";

export default {
  name: "LocksPage",
  components: {
    Document,
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
  async created() {
    await this.fetchData();
    if (this.current_user) {
      await this.fetchUsers();
    }
  },
  methods: {
    ...mapActions("locks", ["fetchFullLocks"]),
    ...mapActions("user", ["fetchUsers"]),
    async fetchData() {
      this.isLoading = true;
      let filters_list = [];
      if (this.filters) {
        for (let i = 0; i < Object.keys(this.filters).length; i++) {
          // si filtre username, get user_ids
          if (Object.keys(this.filters)[i] === 'userName') {
            let filtered_users = this.$store.state.user.users.map(u => u.username.includes(Object.values(this.filters)[i]) ? u.id : false).filter(Boolean);
            console.log('filtered_users : ', filtered_users)
            // assign array of users as list (backend expects list)
            filters_list.push('filter[user_id]=[' + filtered_users + ']');
          }
          else filters_list.push('filter[' + Object.keys(this.filters)[i] + ']=' + Object.values(this.filters)[i]);
        }
      }
      console.log('filters_list : ', filters_list)
      this.fetchedData = await this.fetchFullLocks({
        userId: this.current_user.id,
        sortingPriority: this.sortingPriority,
        numPage: this.numPage,
        pageSize: this.pageSize,
        filters: filters_list.length ? filters_list : null,
      });
      console.log('async fetchData() / this.fetchedData : ', this.fetchedData)
      this.loadAsyncData();
      this.isLoading = false;
    },
    /*TODO add lock sort reset button
    async resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        await this.fetchData();
      }
    },*/
    async onFilter(filters){
      console.log("filters : ", filters);
      if (filters) {
        this.filters = Object.entries(filters).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {});
        console.log('onFilter / this.filters ', this.filters)
        await this.fetchData();
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
      // will reload the data (Note 24022023 : not true)
      //this.currentPage = 1;
    },
    /* function used to regroup locks by docId in the version with multiple historical locks by doc
    (see also loadAsyncData below)

    groupLocksByDoc(arr){

      const mapper = new Map()
      for (const { data, user} of arr) {
        if (!mapper.has(data.attributes['object-id'])) {
          mapper.set(data, { docId: data.attributes['object-id'], lock: [], user})
        }
        mapper.get(data).lock.push(data.attributes)
       }
       return Array.from(mapper.values())
    },*/
    loadAsyncData() {
      if (this.fetchedData) {
        console.log('loadAsyncData() / this.fetchedData : ', this.fetchedData)
        this.totalCount = this.fetchedData.totalCount;

        /* code used to regroup locks by docId in the version with multiple historical locks by doc

        let LocksByDocID = this.groupLocksByDoc(this.fetchedData.locks);
        console.log('LocksByDocID : ', LocksByDocID)

        this.data = LocksByDocID.map(({docId, lock, user}) => {
          const flatLockByDoc = {};

          flatLockByDoc['docId'] = parseInt(docId),
          flatLockByDoc['description'] = lock[0]['description'],
          flatLockByDoc['event_date'] = lock[0]['event-date'],
          flatLockByDoc['expiration_date'] = lock[0]['expiration-date'],
          flatLockByDoc['is_active'] = lock[0]['is-active'],
          flatLockByDoc['user_id'] = user.id,
          flatLockByDoc['username'] = user.username

          return flatLockByDoc;
          })*/

        this.data = this.fetchedData.locks.map((l) => {
            return {
              docId: l.data.attributes['object-id'],
              description: l.data.attributes.description,
              event_date: l.data.attributes['event-date'],
              expiration_date: l.data.attributes['expiration-date'],
              is_active: l.data.attributes['is-active'],
              user_id: l.user.id,
              username: l.user.username
            };
          })
        //console.log('loadAsyncData() / this.data : ', this.data);
      }
    },
    /*
     * Handle page-change event
     */
    onPageChange(page) {
      console.log("tada")
      this.currentPage = page;
    },
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