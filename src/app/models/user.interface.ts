import { IChild } from "./child.interface";
import { Gender } from "./gender.emun";
import { HMO } from "./hmo.enum";

export interface IUser{
    FirstName: string;
    LastName: string;
    UserId: string;
    DOB: Date;
    Gender: Gender;
    HMO: HMO;
    Children?: IChild[];
}