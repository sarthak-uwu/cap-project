sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/Table",
  "sap/m/Column",
  "sap/m/ColumnListItem",
  "sap/m/Text",
  "sap/m/Label"
], function (Controller, MessageToast, MessageBox, Table, Column, ColumnListItem, Text, Label) {
  "use strict";

  return Controller.extend("vendormaster.controller.Create", {

    onInit() {
      this._router = this.getOwnerComponent().getRouter();
      this._loadTable();
    },

    onNavBack() {
      this._router.navTo("Home");
    },

    _getFormData() {
      return {
        LIFNR: this.byId("vendorId").getValue().trim(),
        NAME1: this.byId("vendorName").getValue().trim(),
        ORT01: this.byId("city").getValue().trim(),
        ADRNR: this.byId("addressNumber").getValue().trim(),
        PHONE: this.byId("phoneNumber").getValue().trim()
      };
    },

    _validate(data) {
      if (!data.LIFNR) {
        MessageBox.error("Vendor ID is required.");
        return false;
      }
      if (!/^V\d{3,}$/.test(data.LIFNR)) {
        MessageBox.error("Vendor ID format invalid. Use format like V001, V002 etc.");
        return false;
      }
      if (!data.NAME1) {
        MessageBox.error("Vendor Name is required.");
        return false;
      }
      return true;
    },

    async onSave() {
      const data = this._getFormData();
      if (!this._validate(data)) return;

      try {
        const response = await fetch("/odata/v4/vendor/Vendors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Server error: ${response.status}`);
        }

        MessageToast.show("Vendor created successfully!");
        this.onClear();
        this._loadTable();

      } catch (err) {
        MessageBox.error("Save failed: " + err.message);
      }
    },

    onClear() {
      ["vendorId", "vendorName", "city", "addressNumber", "phoneNumber"]
        .forEach(id => this.byId(id).setValue(""));
    },

    async _loadTable() {
      try {
        const response = await fetch("/odata/v4/vendor/Vendors");

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        const vendors = result.value || [];

        const container = this.byId("tableContainer");
        container.destroyItems();

        if (vendors.length === 0) {
          MessageToast.show("No vendor records found.");
          return;
        }

        const fields = ["LIFNR", "NAME1", "ORT01", "ADRNR", "PHONE"];
        const labels = ["Vendor ID", "Vendor Name", "City", "Address No.", "Phone"];

        const oTable = new Table({
          headerText: "All Vendors",
          columns: labels.map(l =>
            new Column({ header: new Label({ text: l }) })
          )
        });

        vendors.forEach(v => {
          oTable.addItem(
            new ColumnListItem({
              cells: fields.map(f =>
                new Text({ text: v[f] || "—" })
              )
            })
          );
        });

        container.addItem(oTable);

      } catch (err) {
        MessageBox.error("Could not load vendor list: " + err.message);
      }
    }

  });
});