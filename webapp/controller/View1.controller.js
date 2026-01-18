sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View1", { 
        onNavBack: function () {
           
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        }
    });
});