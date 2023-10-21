import { Address } from "./address";

export class User {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    token: string;
    deliveryAddresses: Address[];
}
