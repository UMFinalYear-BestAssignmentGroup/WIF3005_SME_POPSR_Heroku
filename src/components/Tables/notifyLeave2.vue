<template>
  <div>
    <!-- <router-link :to="{ name: 'PSR', params: { id: this.id } }">PSR</router-link> -->
    <!-- <md-table v-model="leaves" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }" v-on:click="routerLinkToDetails(item)" >
        <md-table-cell md-label="Employee ID" click="routerLinkToDetails">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Date Start">{{ item.date_from }}</md-table-cell>
        <md-table-cell md-label="Date End">{{ item.date_to }}</md-table-cell>
        <md-table-cell md-label="Reason">{{ item.reason }}</md-table-cell>
        <md-table-cell md-label="Status">{{ item.status }}</md-table-cell>
      </md-table-row>
    </md-table> -->

    <!-- <b-table :data="leaves" :columns="columns" :hoverable="true" :striped="true" selectable @select="routerLinkToDetails"></b-table> -->

   <b-table :data="isEmpty ? [] : leaves" :striped="true" :hoverable="true" :paginated="true" :per-page="5" aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            :pagination-simple="true"> 
     <template slot-scope="props">
       <b-table-column field="id" label="ID" width="300" >
          <a @click="routerLinkToDetails(props.row)">
              {{ props.row.id }}
          </a>
        </b-table-column>
        <b-table-column field="date_from" label="Start">
            {{ props.row.date_from }}
        </b-table-column>
        <b-table-column field="date_to" label="End">
            {{ props.row.date_to }}
        </b-table-column>
        <b-table-column field="reason" label="Reason">
            {{ props.row.reason }}
        </b-table-column>
        <b-table-column field="status" label="Status">
            {{ props.row.status }}
        </b-table-column>
     </template>
   </b-table>
       <!-- {{leaves}} -->

  </div>
</template>

<script>
import leave from "@/js/leave.js"; //directory to leave.js
export default {
  name: "notify-leave",
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    }
  },
  methods:  {
    routerLinkToDetails(row){
      alert("Enter Method");
      this.$router.push({ path: `/leaveApplication/123` });
    }
  },
  async created() {
        try {
            const data = await leave.show_all_leave();
            console.log(data);
            this.leaves = data.map(leave => ({
                ...leave
            })) 
        } catch (err) { 
            this.error = err.message;
        }
    },
  data() {
    const data = this.leaves
    return {
      dataBackgroundColor: "blue",
      isEmpty: false,
       headers: [
        {
          text: 'Employee ID',
          align: 'left',
          sortable: false,
          value: 'id',
        },
        { text: 'Start', value: 'date_from' },
        { text: 'End', value: 'date_to' },
        { text: 'Reason', value: 'reason' },
        { text: 'Status', value: 'status' },
      ],
        leaves: [], //do for leave in leaves
        error: '',
      selected: [],
      users: [
         {
          id: 1,
          name: "Dakota Rice",
          salary: "$36,738",
          country: "Niger",
          city: "Oud-Turnhout"
        },
        {
          id: 2,
          name: "Minerva Hooper",
          salary: "$23,738",
          country: "Curaçao",
          city: "Sinaai-Waas"
        },
        {
          id: 3,
          name: "Sage Rodriguez",
          salary: "$56,142",
          country: "Netherlands",
          city: "Overland Park"
        },
        {
          id: 4,
          name: "Philip Chaney",
          salary: "$38,735",
          country: "Korea, South",
          city: "Gloucester"
        }
      ],
      columns: [
                    {
                        field: 'id',
                        label: 'ID',
                        width: '300',
                        centered: true
                        // numeric: true
                    },
                    {
                        field: 'date_from',
                        label: 'Start Date',
                        centered: true
                    },
                    {
                        field: 'date_to',
                        label: 'End Date',
                        centered: true
                    },
                    {
                        field: 'reason',
                        label: 'Reasons',
                        centered: true
                    },
                    {
                        field: 'status',
                        label: 'Status',
                        centered: true
                    }
                ]
    };
  }
};
</script>
