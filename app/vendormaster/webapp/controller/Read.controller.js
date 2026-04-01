sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/m/VBox",
  "sap/m/Label",
  "sap/m/Text",
  "sap/m/Title"
], function (Controller, MessageBox, MessageToast, VBox, Label, Text, Title) {
  "use strict";

  return Controller.extend("vendormaster.controller.Read", {

    onInit() {
      this._router = this.getOwnerComponent().getRouter();
    },

    onNavBack() {
      this._router.navTo("Home");
    },

    async onFetch() {
      const id = this.byId("readVendorId").getValue().trim();
      if (!id) {
        MessageBox.error("Please enter a Vendor ID.");
        return;
      }

      try {
        const response = await fetch(`/odata/v4/vendor/Vendors('${id}')`);

        if (response.status === 404) {
          MessageBox.error("Vendor not found with ID: " + id);
          return;
        }

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const vendor = await response.json();
        this._renderDetail(vendor);

      } catch (err) {
        MessageBox.error("Failed to fetch: " + err.message);
      }
    },

    _renderDetail(vendor) {
      const container = this.byId("readResult");
      container.destroyItems();

      const fields = [
        { label: "Vendor ID",      key: "LIFNR" },
        { label: "Vendor Name",    key: "NAME1" },
        { label: "City",           key: "ORT01" },
        { label: "Address Number", key: "ADRNR" },
        { label: "Phone Number",   key: "PHONE" }
      ];

      container.addItem(new Title({ text: "Vendor Details", level: "H3" }));

      fields.forEach(f => {
        const row = new VBox({ class: "sapUiTinyMarginTop sapUiSmallMarginBottom" });
        row.addItem(new Label({ text: f.label }));
        row.addItem(new Text({ text: vendor[f.key] || "—" }));
        container.addItem(row);
      });
    }

  });
});