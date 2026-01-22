sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Fragment, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View1", {
        onNavBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onRefresh: function () {
            debugger;
            var oDataModel = this.getOwnerComponent().getModel("headerDetail");
           // var sSelectedMaterial = this.getView().byId("product1").getSelectedKey();
           var sSelectedMaterial = this.getView().byId("product1").getValue(); 
           var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')";
            //var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')?sap-client=110";
            // Diagnostic: Is the model actually there?
            if (!oDataModel) {
                console.error("Model 'headerDetail' is missing!");
                return;
            }

            // This ensures the metadata is ready before the read fires
            oDataModel.metadataLoaded().then(function () {
                console.log("Metadata loaded. Attempting read...");

                oDataModel.read(sPath, {
                    urlParameters: {
                        "$expand": "to_Plants,to_Valuation"
                    },
                    success: function (oData) {

                        this.getView().setModel(new sap.ui.model.json.JSONModel(oData), "headerDetail");

                    }.bind(this),

                    error: function (oError) {

                        console.error("Read failed details:", oError);
                    }.bind(this)
                });
            }.bind(this)).catch(function (oError) {
                console.error("Metadata promise failed:", oError);
            });
        },

        onMaterialValueHelpRequest: function (oEvent) {
            debugger;
            var oView = this.getView();
            if (!this._pValueHelpDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "cos.qmc.views.qmcviewdemo.view.fragments.MaterialValueHelp",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog); // Essential for named models
                    oDialog.open();
                });
            } else {
                this._pValueHelpDialog.open();
            }
        },

        onMaterialValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oBinding = oEvent.getSource().getBinding("items");

            if (oBinding) {
                var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sValue);
                oBinding.filter([oFilter]);
            } else {
                // If it reaches here, the aggregation binding failed in the XML
                sap.m.MessageToast.show("Binding still initializing, please wait...");
            }
        },
        onMaterialValueHelpSearchtmp: function (oEvent) {
            debugger;
            var sValue = oEvent.getParameter("value");
            var oDialog = oEvent.getSource();

            // 1. Efficiency Check: Only search if user types 3+ characters
            if (!sValue || sValue.length < 3) {
                sap.m.MessageToast.show("Please enter at least 3 characters to search.");
                return;
            }

            // 2. Bind Items Dynamically
            // This triggers the OData request ONLY when this code runs
            oDialog.bindItems({
                path: 'headerDetail>/I_MaterialVH',
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{headerDetail>Material}" }),
                        // Bind using the association path
                        //new sap.m.Text({ text: "{headerDetail>_Text/MaterialName}" }) 
                    ]
                }),
                filters: [
                    new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sValue)
                ]
            });
        },

        onMaterialValueHelpConfirm: function (oEvent) {
            debugger;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sMaterial = oSelectedItem.getCells()[0].getText();
                this.byId("materialInput").setValue(sMaterial);
            }
                oEvent.getSource().unbindItems();
        },


    });
});

