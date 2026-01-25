sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View5", {
        onNavBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onInit: function () {
            // No manual binding needed! 
            // The SmartTable's 'smartFilterId' property handles the connection.
            // This creates a context so the SmartField knows it is 
            // allowed to display an input for the "Material" property
            // this.getView().byId("headerSearchContainer").bindElement("/xCOSxqmc_i_MatHdr('')");
        },

        onSearch: function (oEvent) {
           
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
        },
        onRefresh: function () {

            var oDataModel = this.getOwnerComponent().getModel();
            // var sSelectedMaterial = this.getView().byId("product1").getSelectedKey();
            var sSelectedMaterial = this.getView().byId("materialInput5").getValue();
            var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')";
            //var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')?sap-client=110";
            // Diagnostic: Is the model actually there?
            if (!oDataModel) {
                console.error("Model is missing!");
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

                        this.getView().setModel(new sap.ui.model.json.JSONModel(oData));

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
            var sInputValue = oEvent.getSource().getValue();

            if (!this._oValueHelpDialog) {
                // Create the dialog via fragment
                this._oValueHelpDialog = sap.ui.xmlfragment(
                    "cos.qmc.views.qmcviewdemo.view.fragments.MaterialValueHelpView5",
                    this
                );
                this.getView().addDependent(this._oValueHelpDialog);
            }

            // Open the dialog and filter by the current input value
            this._oValueHelpDialog.getBinding("items").filter([
                new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sInputValue)
            ]);
            this._oValueHelpDialog.open(sInputValue);
        },

        onValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },
 
        onValueHelpClose: function (oEvent) {
            
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var oInput = this.byId("materialInput5"); // Get reference to your Input

            if (!oSelectedItem) {
                return;
            }

            var sSelectedValue = oSelectedItem.getTitle();

            // Option A: Update via the model (Best practice for unnamed models)
            var oModel = this.getView().getModel();
            oModel.setProperty("/Material", sSelectedValue);

            // Option B: Hard-set the value if the binding doesn't refresh
            oInput.setValue(sSelectedValue);
        }
    });
});