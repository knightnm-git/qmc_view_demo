sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, FilterOperator, MessageBox) {
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
                // 1. Get the binding context specifically for the 'headerDetail' model
                var oContext = oSelectedItem.getBindingContext("headerDetail");

                // 2. Get the Material string from that context
                var sSelectedMaterial = oContext.getProperty("Material");

                // 3. Set it into your UNNAMED model (the one the View's Input uses)
                this.getView().getModel().setProperty("/Material", sSelectedMaterial);

                // 4. Trigger the refresh to get the tables
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
                error: function (oError) {
                    debugger;

                    this.getView().setBusy(false);
                    let sMessage = oError.message; //"An unexpected error occurred.";
                    let aMessages = [];

                    try {
                        const oResponse = JSON.parse(oError.responseText);
                        const oErr = oResponse?.error;

                        // Get the main top-level messages
                        // Filter out undefined/null/empty values, then join with a separator
                        sMessage = [oError.message, oErr?.message?.value]
                            .filter(Boolean)      // Removes undefined, null, or empty strings
                            .join(": ");          // Joins them with a colon and space

                        // 2. Check for business-level details (errordetails)
                        const aDetails = oErr?.innererror?.errordetails || oErr?.details;
                        if (Array.isArray(aDetails)) {
                            aMessages = aDetails.map(d => d.message);
                        }

                        // 3. Check for technical resolution (Error_Resolution)
                        const oRes = oErr?.innererror?.Error_Resolution;
                        if (oRes) {
                            // Show technical steps to the user via the show more button
                            if (oRes.SAP_Transaction) aMessages.push("Technical Info: " + oRes.SAP_Transaction);
                            if (oRes.SAP_Note) aMessages.push("See SAP Note: " + oRes.SAP_Note);
                        }

                    } catch (e) {
                        sMessage = "Technical Error: " + oError.statusCode;
                    }

                    sap.m.MessageBox.error(sMessage, {
                        // details: combines all specific messages into the "Show More" section
                        details: aMessages.length > 0 ? aMessages.join("\n") : null
                    });
                }.bind(this)
            });
        },

        onValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                filters: [
                    new Filter("Material", FilterOperator.Contains, sValue),
                    new Filter("Material_Text", FilterOperator.Contains, sValue),
                    new Filter("MaterialType", FilterOperator.Contains, sValue) // Optional: search by type too
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