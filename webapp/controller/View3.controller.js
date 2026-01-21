sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View3", { 
        onNavBack: function () {
           
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },
        onInit: function () {
            
        },
                onRefresh: function () {
            var oDataModel = this.getOwnerComponent().getModel("MaterialData");
            var sSelectedMaterial = this.getView().byId("product3").getSelectedKey();
            var sPath = "/xCOSxqmc_i_MatHdr(Material='" + sSelectedMaterial + "')";
        
                oDataModel.read(sPath, {
                    urlParameters: {
                        "$expand": "to_Plants,to_Valuation"
                    },
                    success: function (oData) {
                       
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oData), "headerDetail");
                        
                    }.bind(this),

                    error: function (oError) {
                       
                        console.error("Read failed details:", oError);
                    }
              
            
            });
        }
   
    });
});