<template>
  <div>
    <b-field label="Status">
      <b-select
        v-model="selectedStatus"
        multiple
        native-size="4"
        expanded
      >
        <option
          v-for="(status, i) in witnessStatuses"
          :key="`status-${i}`"
          :value="status.id"
        >
          {{ status.label }}
        </option>
      </b-select>
    </b-field>

    <b-field label="Tradition">
      <b-select
        v-model="selectedTradition"
        multiple
        native-size="4"
        expanded
      >
        <option
          v-for="(tradition, i) in traditions"
          :key="`status-${i}`"
          :value="tradition.id || 'n/a'"
        >
          {{ tradition.label }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script>

import {statuses, traditions} from '@/components/forms/data' 


export default {
  name: "WitnessStatusTraditionForm",

  data() {
    return {
      selectedStatus: ['base'],
      selectedTradition: ['n/a'],
      witnessStatuses: statuses,
      traditions
    };
  },

  watch: {
    selectedStatus() {
      if (this.selectedStatus.length > 1) {
        this.selectedStatus = [this.selectedStatus[0]];
      }
    },
    selectedTradition() {
      if (this.selectedTradition.length > 1) {
        this.selectedTradition = [this.selectedTradition[0]];
      }
    },
  },
};
</script>


<style lang="scss" scoped>
  .label {
    color: inherit !important;
  }
</style>