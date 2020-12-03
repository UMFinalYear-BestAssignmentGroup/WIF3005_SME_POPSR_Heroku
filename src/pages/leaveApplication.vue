<template>
  <div class="container">
    <b-loading
      :is-full-page="true"
      :active.sync="isLoading"
      :can-cancel="false"
    ></b-loading>

    <form>
      <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
          <h4 class="title">Leave Application</h4>
          <!-- <p class="category">Complete your profile</p> -->
        </md-card-header>
        <md-card-content>
          <b-field label="Dinastia Jati Group of Companies:">
            <b-select v-model="group" expanded>
              <option value="DJSB" selected>DJSB </option>
              <option value="DJMS">DJMS</option>
              <option value="JJSB">JJSB</option>
              <option value="LJSB">LJSB</option>
            </b-select>
          </b-field>
          <div
            class="error"
            v-if="!$v.group.required && isPosted"
            style="margin-top:-1em"
          >
            Group is required
          </div>

           <b-field label="Branch:">
            <b-input v-model="branch"></b-input>
          </b-field>
          <div
            class="error"
            v-if="!$v.branch.required && isPosted"
            style="margin-top:-1em"
          >
            Branch is required
          </div>

          <b-field label="Designation:">
            <b-input v-model="designation"></b-input>
          </b-field>
          <div
            class="error"
            v-if="!$v.designation.required && isPosted"
            style="margin-top:-1em"
          >
            Designation is required
          </div>

          <b-field label="Leave Type:">
            <b-select v-model="leaveType" expanded>
              <option value="ANNUAL LEAVE">ANNUAL LEAVE </option>
              <option value="EMERGENCY LEAVE">EMERGENCY LEAVE</option>
              <option value="MEDICAL LEAVE">MEDICAL LEAVE</option>
              <option value="UNRECORDED LEAVE">UNRECORDED LEAVE</option>
              <option value="OTHERS">OTHERS</option>
            </b-select>
          </b-field>
          <div
            class="error"
            v-if="!$v.leaveType.required && isPosted"
            style="margin-top:-1em"
          >
            Leave Type is required
          </div>

          <div class="md-layout">
            <br />
            <div id="dates">
              <b-field
                label="Start Date:"
                style="display:inline-block; float:left; width:47%"
              >
                <!-- {{isDateDisabled2}} -->
                <md-field>
                  <md-datepicker
                    v-model="startDate"
                    md-immediately
                    :md-disabled-dates="disabled"
                  />
                </md-field>
                <div
                  class="error"
                  v-if="!$v.startDate.required && isPosted"
                  style="margin-top:-3.5em"
                >
                  Start Date is required
                </div>
                <!-- <div
                  class="error"
                  v-else-if="!$v.startDate.minValue && isPosted"
                  style="margin-top:-3em"
                >
                  Start Date must after today date
                </div> -->
              </b-field>
              <b-field
                label="End Date:"
                style="display:inline-block; float:right; width:47%"
              >
                <md-field>
                  <md-datepicker v-model="endDate" md-immediately />
                </md-field>
                <div
                  class="error"
                  v-if="!$v.endDate.required && isPosted"
                  style="margin-top:-3.5em"
                >
                  End Date is required
                </div>
              </b-field>
            </div>
          </div>
          <b-field label="Reasons:">
            <md-field>
              <md-textarea v-model="reason" type="textbox"></md-textarea>
            </md-field>
          </b-field>
          <div
            class="error"
            v-if="!$v.reason.required && isPosted"
            style="margin-top:-2em"
          >
            Reason is required
          </div>
          <b-field label="Emergency Contact Number:">
            <b-input v-model="emergency_contact" type="number"></b-input>
          </b-field>
          <div
            class="error"
            v-if="!$v.emergency_contact.required && isPosted"
            style="margin-top:-1em"
          >
            Emergency Contact is required
          </div>
          <b-field label="Replacement Username:">
            <b-autocomplete
                v-model="replacement"
                :data="username"
                clearable
                @select="option => selected = option">
                <template slot="empty">No results found</template>
            </b-autocomplete>
          </b-field>
          <md-button
            class="md-raised md-success"
            @click="add_leave()"
            style="float:right"
            >Apply</md-button
          >
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
import leave from "@/js/leave.js"; //directory to leave.js
import user from "@/js/user.js"; //directory to user.js
import leaveClass from "@/js/class/leave_class.js"; //directory to leave_class.js
import {
  required,
  minLength,
  sameAs,
  minValue
} from "vuelidate/lib/validators";
export default {
  name: "edit-profile-form",
  data() {
    return {
      dataBackgroundColor: "blue",
      isEmpty: false,
      users: [],
      username: [],
      user_id: [],
      designation: "",
      branch: localStorage.department,
      group: localStorage.branch,
      leaveType: "",
      passUserId: "",
      leaveObj: new leaveClass(),
      isLoading: false,
      error: "",
      is_admin: null,
      name: "",
      startDate: new Date(),
      endDate: null,
      reason: null,
      emergency_contact: null,
      replacement: null,
      isPosted: false,
      disabled: {
        from: new Date()
      },
      // isDateDisabled2: function() {
      //   var today = new Date();
      //   // compare if today is greater then the datepickers date
      //   return new Date() > today;
      // }
    };
  },
  async created() {
    try {
      console.log("Branch")
      console.log(localStorage.branch);
      const clog = await user.check_logged();
      if (clog.err) {
        alert("User not logged in. Please login.");
        this.$router.push({ path: `/login` });
      } else {
        const data = await user.get_all_user();
        console.log("All users");
        console.log(data);
        // this.users = data.map(users => ({
        //   ...users
        // }));
        this.users = data;
        for (var i = 0; i < this.users.length; i++) {
          this.username.push(this.users[i].username);
        }
        for (var i = 0; i < this.users.length; i++) {
          this.user_id.push(this.users[i].id);
        }
        console.log(this.user_id);
      }
    } catch (err) {
      this.error = err.message;
      alert(err);
    }
  },
  validations: {
    group: {
      required
    },
    branch: {
      required
    },
    designation: {
      required
    },
    leaveType: {
      required
    },
    startDate: {
      required
      // minValue: value => value > new Date()
    },
    endDate: {
      required
      // minValue: value => value > this.startDate
    },
    reason: {
      required
    },
    emergency_contact: {
      required
    }
  },
  mounted() {
    if (localStorage.is_admin) {
      this.is_admin = localStorage.is_admin;
    }
  },
  methods: {
    openLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10 * 1000);
    },
    async add_leave() {
      this.isPosted = true;
      if (!this.$v.$invalid) {
        try {
          this.isLoading = true;
          // To calculate the time difference of two dates
          var Difference_In_Time =
            this.endDate.getTime() - this.startDate.getTime();
          // To calculate the no. of days between two dates
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          if (this.startDate >= new Date()) {
            if (
              this.startDate &&
              this.endDate &&
              this.reason &&
              Difference_In_Days > 0
            ) {
              this.passUserId = this.user_id[
                this.username.indexOf(this.replacement)
              ];
              alert(this.username.indexOf(this.replacement));
              this.mapObj();
              console.log("Leave Object");
              console.log(this.leaveObj);
              const leave_data = await leave.add_leave(this.leaveObj);
              // alert(leave_data); //can be ignored
              console.log(this.admin);
              this.isLoading = false;
              // localStorage.message = "Leave Application Submitted";
              // this.$router.push({ path: `/message/${this.id}` });
              this.$buefy.snackbar.open({
                duration: 3000,
                message: "Sending Leave Application",
                type: "is-warning",
                position: "is-top",
                actionText: "OK"
              });
              this.$router.push({ path: `/myApplication/${this.id}` });
            } else if (Difference_In_Days < 0) {
              alert("End Date must after Start Date");
              this.isLoading = false;
            } else {
              alert("All fields are Mandatory");
              this.isLoading = false;
            }
          } else {
            alert("Start date must be later than today");
            this.isLoading = false;
          }
          //add redirect to other page here
          // alert("Success");
        } catch (err) {
          this.error = err.message;
          alert(err);
          this.isLoading = false;
        }
      }
    },
    mapObj() {
      this.leaveObj.group = this.group;
      this.leaveObj.branch = this.branch;
      this.leaveObj.designation = this.designation;
      this.leaveObj.leave_type = this.leaveType;
      this.leaveObj.date_from = this.startDate;
      this.leaveObj.date_to = this.endDate;
      this.leaveObj.reason = this.reason;
      this.leaveObj.emergency_contact = this.emergency_contact;
      this.leaveObj.replace_id = this.passUserId;
    }
  }
};
</script>

<style scoped>
.md-card {
  display: inline-block;
  position: relative;
  /* width: 390%; */
  width: 1000px;
  margin: 25px 0;
  overflow: unset;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.87);
  background: #fff;
}
.md-textarea {
  border: 1px solid #ccc !important;
  border-radius: 16px;
}
.error {
  color: red;
  margin-top: -2em;
  font-weight: 600;
  align-content: center;
  margin-left: 1em;
}
#dates {
  border-radius: 15px;
  border: 1px solid #d2d2d2;
  padding: 20px;
  width: 100%;
  height: 150px;
}
.label {
  font-size: 10rem;
}
</style>