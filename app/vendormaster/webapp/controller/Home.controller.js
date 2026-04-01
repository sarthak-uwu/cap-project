sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("vendormaster.controller.Home", {

    onInit() {
      this._router = this.getOwnerComponent().getRouter();
    },

    onNavigate(sRoute) {
      this._router.navTo(sRoute);
    }

  });
});