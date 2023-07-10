import { Component, OnInit ,ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { IUser } from 'src/app/models/user.interface';
import { FormControl, Validators,FormGroupDirective} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { IChild } from 'src/app/models/child.interface';
import { ErrorStateMatcher } from '@angular/material/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})

export class RegisterFormComponent implements OnInit{
@ViewChild("myForm") form: any; 
// @ViewChild("childForm") childForm: NgForm; 

  user:IUser;
  newChild:IChild;
  u: IUser = {
    FirstName: "", LastName: "", UserId: "", DOB: null, Gender: 0, HMO: 0, Children: [],
  }
  c: IChild = {
    FirstName:"", ChildId:"", DOB: null,
  }

  hmo: { name: string, code: number }[] =
    [{ name: 'Clalit', code: 0 }, { name: 'Maccabi', code: 1 },
    { name: 'Meuhedet', code: 2 }, { name: 'Leumit', code: 3 }]

  matcher = new MyErrorStateMatcher();

  constructor(private userService:UserService){}
  
  ngOnInit(): void {
    this.userService.currentUser.subscribe(data=>{
      this.user=data==null?this.u:data;})
    this.userService.currentChild.subscribe(data=>{
      this.newChild=data==null? this.c:data;})
  }

  ngOnDestroy(): void {
    this.userService.currentUser.next(this.user);
    this.userService.currentChild.next(this.newChild);
  }

  public addChild(): void {
    console.log("add child ");
    const child: IChild = {
      FirstName: "", ChildId: "", DOB: null,
    };
    this.user.Children.push(child);
    console.log("child**********", child);
    this.userService.currentChild.next(null);
  }
  
  public onSubmitForm(){
    if(this.form.valid){
      console.log("user   ",this.user);
      console.log("on submit");
      this.userService.currentUser.next(this.user);
      const user = this.userService.currentUser.getValue();
      user.Gender = Number(user.Gender); 
      user.HMO = Number(user.HMO);
      this.userService.addUser(user).subscribe(succ => {
        this.downloadExcel();
        console.log("succ to add user:",user);
        this.form.resetForm()},
        err => {
          console.log("can't to add user:",user)
        });
    }
  }
  downloadExcel() {
    //create new excel work book
    let workbook1 = new Workbook();
    let workbook2 = new Workbook();
    //add name to sheet
    let worksheet1 = workbook1.addWorksheet("User");
    let worksheet2 = workbook1.addWorksheet("Children");
    //add a column name for user
    let header = ["first-name", "last-name", "id", "date-of-birth", "gender", "hmo"]
    worksheet1.addRow(header);
    //add a column name for children
    header = ["first-name", "id", "date-of-birth"]
    worksheet2.addRow(header);
    const u:IUser= this.userService.currentUser.getValue();
    let json_data_user = [{
      "first-name": u.FirstName,
      "last-name": u.LastName,
      "id": u.UserId,
      "date-of-birth": u.DOB?.toLocaleDateString(),
      "gender": u?.Gender == 0 ? 'male' : 'female',                                                                                                                                                                                                                                                                                                                                                                                                                                
      "hmo": this.hmo[u.HMO]?.name
    }]

    let json_data_children = []
    this.userService.currentUser.getValue().Children.forEach(element => {
      json_data_children.push({
        "first-name": element.FirstName,
        "date-of-birth": element.DOB?.toLocaleString(),
        "id": element.ChildId
      })
    });

    for (let x1 of json_data_user) {
      let x2 = Object.keys(x1);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y])
      }
      worksheet1.addRow(temp)
    }
    for (let x1 of json_data_children) {
      let x2 = Object.keys(x1);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y])
      }
      worksheet2.addRow(temp)
    }

    //set downloadable file name
    let fileName = "user details"

    //add data and file name and download
    workbook1.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.xlsx');
    });
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const isReset = control && control.value === '';
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted) && !isReset);
  }
}