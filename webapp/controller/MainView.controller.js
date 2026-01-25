sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.MainView", {

        
        onGoToList: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
        onGoToObject: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
        },
        onGoToView3: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView3");
        },
        onGoToView4: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RouteView4");
        },
        onGoToView5: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RouteView5");    
        },
        
        onGoToView6: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RouteView6");    
        }
    });
});