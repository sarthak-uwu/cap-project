using { com.project.vendormaster as db } from '../db/ZVM_ST_2703';

service VendorService @(path:'/odata/v4/vendor') {
  entity Vendors as projection on db.VendorMaster;
}