sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/VBox",
  "sap/m/Label",
  "sap/m/Text",
  "sap/m/Title"
], function (Controller, MessageToast, MessageBox, VBox, Label, Text, Title) {
  "use strict";

  return Controller.extend("vendormaster.controller.Delete", {

    onInit() {
      this._router = this.getOwnerComponent().getRouter();
      this._currentVendor = null;
    },

    onNavBack() {
      this._router.navTo("Home");
    },

    async onFetch() {
      const id = this.byId("deleteVendorId").getValue().trim();
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
        this._currentVendor = vendor;
        this._renderPreview(vendor);

      } catch (err) {
        MessageBox.error("Failed to fetch: " + err.message);
      }
    },

    _renderPreview(vendor) {
      const container = this.byId("deleteResult");
      container.destroyItems();

      const fields = [
        { label: "Vendor ID",      key: "LIFNR" },
        { label: "Vendor Name",    key: "NAME1" },
        { label: "City",           key: "ORT01" },
        { label: "Address Number", key: "ADRNR" },
        { label: "Phone Number",   key: "PHONE" }
      ];

      container.addItem(new Title({ text: "Vendor to Delete", level: "H3" }));

      fields.forEach(f => {
        const row = new VBox({ class: "sapUiTinyMarginTop sapUiSmallMarginBottom" });
        row.addItem(new Label({ text: f.label }));
        row.addItem(new Text({ text: vendor[f.key] || "—" }));
        container.addItem(row);
      });

      this.byId("previewPanel").setVisible(true);
    },

    async onConfirmDelete() {
      if (!this._currentVendor) return;

      try {
        const response = await fetch(`/odata/v4/vendor/Vendors('${this._currentVendor.LIFNR}')`, {
          method: "DELETE"
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Server error: ${response.status}`);
        }

        MessageToast.show(`Vendor ${this._currentVendor.LIFNR} deleted successfully!`);
        this.byId("deleteVendorId").setValue("");
        this.byId("deleteResult").destroyItems();
        this.byId("previewPanel").setVisible(false);
        this._currentVendor = null;

      } catch (err) {
        MessageBox.error("Delete failed: " + err.message);
      }
    },

    onCancel() {
      this.byId("deleteResult").destroyItems();
      this.byId("previewPanel").setVisible(false);
      this._currentVendor = null;
    }

  });
});