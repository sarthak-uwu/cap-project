sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/Input",
  "sap/m/Label"
], function (Controller, MessageToast, MessageBox, Input, Label) {
  "use strict";

  return Controller.extend("vendormaster.controller.Update", {

    onInit() {
      this._router = this.getOwnerComponent().getRouter();
      this._currentId = null;
    },

    onNavBack() {
      this._router.navTo("Home");
    },

    async onLoad() {
      const id = this.byId("updateLookupId").getValue().trim();
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
        this._currentId = vendor.LIFNR;
        this._renderEditForm(vendor);

      } catch (err) {
        MessageBox.error("Failed to fetch: " + err.message);
      }
    },

    _renderEditForm(vendor) {
      const form = this.byId("updateFormContainer");
      form.destroyContent();

      const fields = [
        { label: "Vendor ID",      key: "LIFNR", editable: false },
        { label: "Vendor Name",    key: "NAME1", editable: true  },
        { label: "City",           key: "ORT01", editable: true  },
        { label: "Address Number", key: "ADRNR", editable: true  },
        { label: "Phone Number",   key: "PHONE", editable: true  }
      ];

      this._inputs = {};

      fields.forEach(f => {
        const input = new Input({
          value: vendor[f.key] || "",
          editable: f.editable,
          width: "50%"
        });
        form.addContent(new Label({ text: f.label }));
        form.addContent(input);
        this._inputs[f.key] = input;
      });

      this.byId("editPanel").setVisible(true);
    },

    async onSave() {
      if (!this._currentId) {
        MessageBox.error("Please load a vendor first.");
        return;
      }

      const updated = {
        NAME1: this._inputs["NAME1"].getValue().trim(),
        ORT01: this._inputs["ORT01"].getValue().trim(),
        ADRNR: this._inputs["ADRNR"].getValue().trim(),
        PHONE: this._inputs["PHONE"].getValue().trim()
      };

      if (!updated.NAME1) {
        MessageBox.error("Vendor Name is required.");
        return;
      }

      try {
        const response = await fetch(`/odata/v4/vendor/Vendors('${this._currentId}')`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Server error: ${response.status}`);
        }

        MessageToast.show("Vendor updated successfully!");

      } catch (err) {
        MessageBox.error("Update failed: " + err.message);
      }
    }

  });
});