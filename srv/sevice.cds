using { myfirstapp } from '../db/schema';

service StudentService {

    @UI.LineItem: [
        { Value: ID },
        { Value: name },
        { Value: age }
    ]
    entity Students 
        as projection on myfirstapp.Students;

}