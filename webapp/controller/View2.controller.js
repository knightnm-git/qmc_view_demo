sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("cos.qmc.views.qmcviewdemo.controller.View2", { 
        onInit: function () {
            var oData = {
                demoItems: [
                    {
                        PlantID: "2020",
                        MrpType: "PD",
                        LotSize: "EX",
                        StExtProc: "2021",
                        StorageBin: "",
                        isCritical: false,
                        PdtValue: "10"
                    },
                    {
                        PlantID: "3010",
                        MrpType: "PD",
                        LotSize: "E1",
                        StExtProc: "301C",
                        StorageBin: "",
                        isCritical: true,
                        PdtValue: "105"
                    },
                                       {
                        PlantID: "3020",
                        MrpType: "PD",
                        LotSize: "EX",
                        StExtProc: "302C",
                        StorageBin: "",
                        isCritical: false,
                        PdtValue: "15"
                    },
                                       {
                        PlantID: "3030",
                        MrpType: "ND",
                        LotSize: "EX",
                        StExtProc: "303A",
                        StorageBin: "",
                        isCritical: true,
                        PdtValue: "75"
                    }
                   ,
                                      {
                        PlantID: "3040",
                        MrpType: "PD",
                        LotSize: "EX",
                        StExtProc: "301C",
                        StorageBin: "",
                        isCritical: false,
                        PdtValue: "15"
                    } 
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "demo");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        }
    });
});