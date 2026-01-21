sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
], function (Controller, JSONModel, Fragment) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View2", {

        onInit: function () {

        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onPress: function (oEvent) {
            debugger;
            var oView = this.getView(),
                oButton = oEvent.getSource(); // Better: get the button directly from the click event

            // If the fragment doesn't exist yet, load it
            if (!this._pMenu) {
                this._pMenu = Fragment.load({
                    id: oView.getId(),
                    name: "cos.qmc.views.qmcviewdemo.view.fragments.Menu",
                    controller: this
                }).then(function (oMenu) {
                    oView.addDependent(oMenu); // Ensure models are available to the fragment
                    return oMenu;
                });
            }

            // Handle the Promise
            this._pMenu.then(function (oMenu) {
                if (oMenu.isOpen()) {
                    oMenu.close();
                } else {
                    oMenu.openBy(oButton);
                }
            });
        },
        onRefresh: function () {
            var oDataModel = this.getOwnerComponent().getModel("MaterialData");
            var sSelectedMaterial = this.getView().byId("product2").getSelectedKey();
            var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')";

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
            
            });
        }

    });
});