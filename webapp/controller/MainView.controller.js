sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.MainView", {
        onGoToList: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RouteList");
        },
        onGoToObject: function () {
            this.getOwnerComponent().getRouter().navTo("RouteObject");
        }
    });
});