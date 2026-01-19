sap.ui.define([
    "sap/ui/core/UIComponent",
    "cos/qmc/views/qmcviewdemo/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("cos.qmc.views.qmcviewdemo.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // Initialize your demo data
            this.initDemoModel();
        },
        initDemoModel: function () {
            var oData = {
                demoClient: {
                    MatNumb: "",
                    Description: "",
                    MatType: "ROH",
                    MatGrp: "L009",
                    BaseUnit: "PC",
                    GrossWeight: "0.500",
                    NetWeight: "0.400",
                    WeightUnit: "KG",
                    Manuf: "",
                    MfrPartNumb: ""
                },
                demoPlants: [
                    { PlantID: "2020", MrpType: "PD", LotSize: "EX", StExtProc: "2021", StorageBin: "", isCritical: false, PdtValue: "10" },
                    { PlantID: "3010", MrpType: "PD", LotSize: "E1", StExtProc: "301C", StorageBin: "", isCritical: true, PdtValue: "105" },
                    { PlantID: "3020", MrpType: "PD", LotSize: "EX", StExtProc: "302C", StorageBin: "", isCritical: false, PdtValue: "15" },
                    { PlantID: "3030", MrpType: "ND", LotSize: "EX", StExtProc: "303A", StorageBin: "", isCritical: true, PdtValue: "75" },
                    { PlantID: "3040", MrpType: "PD", LotSize: "EX", StExtProc: "301C", StorageBin: "", isCritical: false, PdtValue: "15" }
                ],
                demoVal: [
                    { ValArea: "3010", ValType: "", PrTyp: "S", MvAvgPrice: "0.00", StdPrice: "2.32", PrUnit: "1", ValClass: "3000", ValCat: "" },
                    { ValArea: "2020", ValType: "", PrTyp: "S", MvAvgPrice: "0.00", StdPrice: "2.32", PrUnit: "1", ValClass: "3000", ValCat: "" }
                ]
            };

            var oModel = new JSONModel(oData);
            // Setting the model on the Component makes it available to all Views
            this.setModel(oModel, "demo");
        }
    });
});