sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View7", {
        onNavBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        
        onInit: function () {
            // Initialize the unnamed model immediately
            var oModel = new JSONModel({
                Material: ""
            });
            this.getView().setModel(oModel);
        },

        onMaterialValueHelpRequest: function () {
            var oView = this.getView();
            // Singleton pattern to prevent "Duplicate ID" on 2nd click
            if (!this._oSelectDialog) {
                this._oSelectDialog = sap.ui.xmlfragment(oView.getId(), "cos.qmc.views.qmcviewdemo.view.fragments.MaterialValueHelpView7", this);
                oView.addDependent(this._oSelectDialog);
            }
            this._oSelectDialog.open();
        },

        onValueConfirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sSelectedMaterial = oSelectedItem.getTitle();
                // 1. Update the property in the unnamed model
                this.getView().getModel().setProperty("/Material", sSelectedMaterial);

                // 2. Trigger the refresh logic
                this.onRefresh();
            }
        },

        onValueHelpClose: function (oEvent) {
            // Close using the source of the event to avoid "close is not a function" errors
            oEvent.getSource().close();
        },

        onRefresh: function () {
            var oDataModel = this.getOwnerComponent().getModel(); // OData
            var oViewModel = this.getView().getModel(); // Unnamed JSON
            var sMaterial = oViewModel.getProperty("/Material");

            if (!sMaterial) return;

            // Clear the specific arrays so the tables show empty/busy 
            // instead of showing the previous material's data.
            oViewModel.setProperty("/to_Plants", null);
            oViewModel.setProperty("/to_Valuation", null);

            var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sMaterial + "')";
            this.getView().setBusy(true);

            oDataModel.read(sPath, {
                urlParameters: { "$expand": "to_Plants,to_Valuation" },
                success: function (oData) {
                    this.getView().setBusy(false);
                    // IMPORTANT: 'true' merges data. 
                    // It keeps {/Material} and adds {/to_Plants}, etc.
                    oViewModel.setData(oData, true);
                }.bind(this),
                error: function () {
                    this.getView().setBusy(false);
                }.bind(this)
            });
        },

        onValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                filters: [
                    new Filter("Material", FilterOperator.Contains, sValue),
                    new Filter("Material_Text", FilterOperator.Contains, sValue)
                ],
                and: false
            });
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        onMaterialChange: function (oEvent) {
            var sNewValue = oEvent.getParameter("value");

            // 1. Force the model to update with the manual entry
            // This ensures the model has the value before onRefresh reads it
            this.getView().getModel().setProperty("/Material", sNewValue);

            // 2. Clear old table data (as we discussed) and fetch new data
            if (sNewValue) {
                this.onRefresh();
            } else {
                // Optional: Clear the whole model if the user deletes the input text
                this.getView().getModel().setData({ Material: "" });
            }
        },
    });
});