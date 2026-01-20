sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View1", {
        onNavBack: function () {

            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onRefresh: function () {
            var oDataModel = this.getOwnerComponent().getModel("tmpMaterial");
            var sSelectedMaterial = this.getView().byId("product1").getSelectedKey();
            var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')";
            //var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')?sap-client=110";
            // Diagnostic: Is the model actually there?
            if (!oDataModel) {
                console.error("Model 'tmpMaterial' is missing!");
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
        }
    });
});

