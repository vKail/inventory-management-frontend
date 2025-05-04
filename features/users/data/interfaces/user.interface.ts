import { Department } from "@/features/departments/data/enums/department.enum";
import { UserRole } from "../enums/user-roles.enums";

export interface IUserResponse {
    id:               string;
    idNumberTaxId:    string;
    fullName:         string;
    email:            string;
    userType:         string;
    status:           string;
    phone:            string;
    department:       string;
    degreeProgram:    string;
    position:         string;
    registrationDate: Date;
    lastLogin:        Date;
    active:           boolean;
    updateDate:       Date;
}
