<template>
  <div class="myWidget" :ref="'browseUser-' + widgetId">
    <div class="buttonControl" title="refresh information">                                 <!-- buttons used to manage added widgets -->
      <b-button @click="moveWidgets(widgetIdx, -1)" title="move to left">
        <img src="../../../assets/left-arrow.png" alt="">
      </b-button>
      <b-button @click="moveWidgets(widgetIdx, +1)" title="move to right">
        <img src="../../../assets/right-arrow.png" alt="">
      </b-button>
      <b-button @click="refresh">
        <img src="../../../assets/refresh.png" alt="">
      </b-button>
      <b-button v-b-modal @click="showEdit" title="edit widget">
        <img src="../../../assets/editing.png" alt="">
      </b-button>
      <b-button @click="sendDelete" title="delete widget">
        <img src="../../../assets/delete.png" alt="">
      </b-button>
    </div>

    <div class="myWidget-content">
        <!-- add displayed elements here -->
    </div>

    <b-modal
      :id="'modal-edit-config-' + widgetId"
      :title="myConfig['service'] + ' : ' + myConfig['widget']"
      @ok="submitConfig"
      @close="closeModal"
      ok-only
    >                                                                                      <!-- modal used to edit informations-->
      <div class="listWidgets">
        <h3>Parameters</h3>
        <div v-for="(key, value, index) in parameters" :key="index">
          <fieldset class="myFieldSet">
            <label :for="value"> {{ value }} </label>
            <input
              v-model="parameters[value]"
              :placeholder="value"
              :id="value"
              required
            />
          </fieldset>
        </div>
        <p v-if="formError" style="color: red; text-align: center;">{{ errorDescription }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: "user_information",
  needOauth: true, // If true it will not be displayed when adding a new widget until the user has signed in to the service
  needService: "Reddit", // Used to check if the user is logged in the required service
  props: ["config", "widgetIdx", "widgetId"], // Dashboard will pass the widgets information (stringified json), the widget Id and the widget index as props
  data() {
    return {
      myConfig: JSON.parse(this.config), // every information about the widget, service, and parameters
      parameters: JSON.parse(JSON.stringify(JSON.parse(this.config))).config, // widget's configuration (refresh rate, ...)
      formError: false,
      errorDescription: "", // displays error on widget edition
    };
  },
  methods: {
    async getInfos() {
      // get datas from the back-end
    },

    // next functions are mandatory to manage edit modal and interact with the widget container and to save changes when the widget is edited, moved or deleted
    showEdit() {
      let modal = "modal-edit-config-" + this.widgetId;
      this.$nextTick(() => {
        this.$bvModal.show(modal);
      });
    },
    hideEdit() {
      let modal = "modal-edit-config-" + this.widgetId;
      this.$nextTick(() => {
        this.$bvModal.hide(modal);
      });
    },
    closeModal () {
      this.formError = false;
      this.errorDescription = "";
      this.clearForm();
    },
    submitConfig(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (JSON.stringify(this.parameters) === "{}") {
        this.errorDescription = "Fill the parameters or quit with the cross in the right top corner";
        this.formError = true;
        return;
      } else if ( !("refresh_rate" in this.parameters) || !/^\d+$/.test(this.parameters["refresh_rate"])) {
        this.errorDescription = "Refresh rate must be only digits and at least 120s";
        this.formError = true;
        return;
      }
      for (const value of Object.entries(this.parameters)) {
        var strValue = value[0];
        if (!this.parameters[strValue].replace(/\s/g, "").length) {
          console.log("Missing value for " + strValue + " field");
          this.errorDescription = "Missing value for " + strValue + " field";
          this.formError = true;
          return;
        }
      }
      this.errorDescription = "";
      this.formError = false;
      this.hideEdit();
      this.myConfig.config = this.parameters
      this.sendEditConfig();
    },
    refresh() {
      // call here your functions to refresh data for example:
      this.getUserInfos();
    },
    sendDelete() { // tell dashboard that the widget was deleted
      this.$emit("delete_widget", this.widgetIdx, this.widgetId);
    },
    sendEditConfig() { // tell dashboard that the widget was edited
      this.$emit("edit_config", JSON.stringify(this.myConfig), this.widgetIdx, this.widgetId);
    },
    moveWidgets (id, direction) { // tell dashboard that the widget was moved
      this.$emit("move_widget",  id, direction);
    }
  },
  mounted() {
     // get informations on widget addition for example:
    this.getUserInfos();
  },
};
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900);

/* basic classes to contain widget elements */

.myWidget {
  max-width: 100%;
  margin: 20px 30px;
  width: 300px;
  border: none;
  border-radius: 20px;
  background-color: #66B4F9;
  font-family: 'Lato', sans-serif;
}

.myWidget-content {
  padding: 5px 32px 20px 32px;
  border-radius: 0 0 8px 8px;
  margin: auto;
  height: calc(100% - 45px);
  justify-content: space-evenly;
}

/* edition modal styling */

.listWidgets {
  display: flex;
  flex-direction: column;
}

.listWidgets button {
  width: 70%;
  margin: 0 auto 12px auto;
}

.myFieldSet {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  margin: 10px 0;
}

.myFieldSet input {
  padding: 0;
}

.myFieldSet label {
  font-weight: 500;
}

/* style for buttons */

.buttonControl {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-radius: 7px 7px 0 0;
  padding: 0px 80px 0 0;
}

.buttonControl button {
  background: rgba(0,0,0,0);
  max-height: 25px;
  max-width: 25px;
  padding: 2px;
  border: none;
  margin-right: 3px;
}

.buttonControl button img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

</style>