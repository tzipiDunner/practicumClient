import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { IChild } from '../models/child.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser:BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  currentChild:BehaviorSubject<IChild> = new BehaviorSubject<IChild>(null);
  baseRouteUrl = `${environment.baseUrl}/User`;

  constructor(private http:HttpClient) { }

  addUser(user:IUser): Observable<IUser>{
    console.log("sr user",user);
    return this.http.post<IUser>(`${this.baseRouteUrl}`,user);
  }
}
