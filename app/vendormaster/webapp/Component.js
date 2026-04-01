sap.ui.define([
  "sap/ui/core/UIComponent"
], function (UIComponent) {
  "use strict";

  // ── OData Model — available globally as window.Model ──
  const BASE_URL = "http://localhost:4004/odata/v4/vendor/Vendors";

  window.Model = {

    async createVendor(data) {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status} ${res.statusText}`);
      return await res.json();
    },

    async getAllVendors() {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      const json = await res.json();
      return json.value || [];
    },

    async getVendorById(id) {
      const res = await fetch(`${BASE_URL}('${id}')`);
      if (res.status === 404) throw new Error(`Vendor "${id}" not found.`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      return await res.json();
    },

    async updateVendor(id, data) {
      const res = await fetch(`${BASE_URL}('${id}')`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 404) throw new Error(`Vendor "${id}" not found.`);
      if (!res.ok) throw new Error(`Update failed: ${res.status} ${res.statusText}`);
      return true;
    },

    async deleteVendor(id) {
      const res = await fetch(`${BASE_URL}('${id}')`, { method: "DELETE" });
      if (res.status === 404) throw new Error(`Vendor "${id}" not found.`);
      if (!res.ok) throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
      return true;
    },
  };

  // ── UI5 Component ──
  return UIComponent.extend("vendormaster.Component", {

    metadata: {
      manifest: "json"
    },

    init() {
      UIComponent.prototype.init.apply(this, arguments);
      this.getRouter().initialize();
    }

  });
});