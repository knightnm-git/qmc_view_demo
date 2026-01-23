sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View4", {
        onNavBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onInit: function () {
            // No manual binding needed! 
            // The SmartTable's 'smartFilterId' property handles the connection.
        },

        onSearch: function (oEvent) {
            debugger;
            // 1. Get references to the controls
            var oSmartFilterBar = this.byId("smartFilterBar4");
            var oSmartForm = this.byId("smartForm4");
            var oIconTabBar = this.byId("idIconTabBar4");

            // 2. Get the selected Material ID
            // getFilterData() returns an object like { Material: "MAT-100" }
            var oFilterData = oSmartFilterBar.getFilterData();
            var sMaterialId = oFilterData.Material;

            if (sMaterialId) {
                // 3. Create the OData Path for your specific record
                // It must look like: /xCOSxqmc_i_MatHdr('MAT-100')
                var sPath = "/xCOSxqmc_i_MatHdr('" + sMaterialId + "')";

                // 4. Bind the data to the UI components
                // This "points" the Form and the Tabs to the specific record data
                oSmartForm.bindElement(sPath);
                oIconTabBar.bindElement(sPath);

                console.log("Context bound to: " + sPath);
            } else {
                sap.m.MessageToast.show("Please select a Material in the search bar first.");
            }
        }

    });
});