import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})

export class InstructionsComponent implements OnInit{
  userName={firstName:" ",familyName:" "};

  constructor(public userService:UserService){}

  ngOnInit(): void {
    this.userService.currentUser.subscribe(data=>{this.userName.familyName=data?.LastName;
      this.userName.firstName=data?.FirstName;
    })
  }
}
