sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View5", {
        onNavBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onInit: function () {

        },

        onRefresh: function () {

            var oDataModel = this.getOwnerComponent().getModel();

            var sSelectedMaterial = this.getView().byId("materialInput5").getValue();
            var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')";

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
        onMaterialValueHelpRequest1: function () {

            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = sap.ui.xmlfragment("cos.qmc.views.qmcviewdemo.view.fragments.MaterialValueHelpView5", this);
                this.getView().addDependent(this._oValueHelpDialog);

                // Define the columns for the internal table
                var oColModel = new sap.ui.model.json.JSONModel({
                    cols: [
                        { label: "Material", template: "Material" },
                        { label: "Description", template: "Material_Text" },
                        { label: "Type", template: "MaterialType" }
                    ]
                });
                this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(oColModel, "columns");


                    oTable.bindRows({
                        path: "/I_MaterialVH",

                    });

                    if (oTable.setSelectionMode) {
                        oTable.setSelectionMode("Single");
                    }
                }.bind(this));
            }
            this._oValueHelpDialog.open();
        },
        onValueHelpOk: function (oEvent) {
            debugger;
            var oValueHelpDialog = oEvent.getSource();
            var aTokens = oEvent.getParameter("tokens");
            var sKey;

            if (aTokens && aTokens.length > 0) {
                // Standard way: Get key from token
                sKey = aTokens[0].getKey();
            } else {
                // Fail-safe way: Get it directly from the table's selection
                var oTable = oValueHelpDialog.getTable();
                var iSelectedIndex = oTable.getSelectedIndex();
                if (iSelectedIndex !== -1) {
                    var oContext = oTable.getContextByIndex(iSelectedIndex);
                    sKey = oContext.getProperty("Material");
                }
            }

            if (sKey) {
                var oModel = this.getView().getModel();

                // 1. Explicitly set the property in the model
                oModel.setProperty("/Material", sKey);

                // 2. Force the Input field to show the value (backup)
                var oInput = this.byId("materialInput5");
                if (oInput) {
                    oInput.setValue(sKey);
                }

                // 3. Optional: If using OData, you might need to trigger a refresh 
                // if the model isn't "TwoWay"
                // oModel.refresh(true); 

                this._oValueHelpDialog.close();
            }
            else {
                sap.m.MessageToast.show("Please select a material first.");
            }
        },

        onFilterBarSearch: function (oEvent) {

            // selectionSet contains the input controls directly
            var aSelectionSet = oEvent.getParameter("selectionSet");

            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                // oControl is the actual Input, so we use oControl.getValue()
                // We get the 'name' from the custom data or the ID we gave it
                var sValue = oControl.getValue();
                var sFieldName = oControl.getName(); // This matches the 'name' property in XML

                if (sValue) {
                    aResult.push(new sap.ui.model.Filter(sFieldName, "Contains", sValue));
                }
                return aResult;
            }, []);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                oTable.getBinding("rows").filter(aFilters);
            });
        },

        onValueHelpClose1: function () {
            if (this._oValueHelpDialog) {
                this._oValueHelpDialog.close();
                // Optional: you can destroy it if you want to force 
                // a clean reload of data next time it opens
                this._oValueHelpDialog.destroy();
                this._oValueHelpDialog = null;
            }
        },
        onMaterialValueHelpRequest: function () {
            // 1. If dialog doesn't exist, create it
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = sap.ui.xmlfragment("cos.qmc.views.qmcviewdemo.view.fragments.MaterialValueHelpView5", this);
                this.getView().addDependent(this._oValueHelpDialog);

                // Define the columns (This only needs to happen once per creation)
                var oColModel = new sap.ui.model.json.JSONModel({
                    cols: [
                        { label: "Material", template: "Material" },
                        { label: "Description", template: "Material_Text" },
                        { label: "Type", template: "MaterialType" }
                    ]
                });

                this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(oColModel, "columns");

                    oTable.bindRows({
                        path: "/I_MaterialVH",

                    });

                    if (oTable.setSelectionMode) {
                        oTable.setSelectionMode("Single");
                    }
                }.bind(this));
            }

            // 2. Open the dialog
            this._oValueHelpDialog.open();
        },

        onValueHelpClose: function () {
            if (this._oValueHelpDialog) {
                // CLOSE instead of DESTROY. 
                // This keeps the instance alive for the second click.
                this._oValueHelpDialog.close();
            }
        },
    });
});