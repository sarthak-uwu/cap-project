using { com.project.vendormaster.VendorMaster as DB_Vendormaster } from '../db/ZVM_ST_2703';

service VendorService {

    @UI.LineItem: [
        { Value: LIFNR, Label: 'Vendor ID' },
        { Value: NAME1, Label: 'Vendor Name' },
        { Value: ORT01, Label: 'City' },
        { Value: ADRNR, Label: 'Address Number' },
        { Value: PHONE, Label: 'Phone Number' }
    ]

    @UI.HeaderInfo: {
        TypeName: 'Vendor',
        TypeNamePlural: 'Vendors',
        Title: { Value: NAME1 },
        Description: { Value: ORT01 }
    }

    entity Vendors
        as projection on DB_Vendormaster;

}