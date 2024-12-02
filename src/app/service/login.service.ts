import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NewUser, User} from "../classes/Settings";

// const BASE_URL = 'http://localhost:8080/amarasiri';
const BASE_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) {
  }

  loginToSystem(payload: any) {
    return this.httpClient.post(`${BASE_URL}/api/auth/signin`, payload, this.httpOptions);
  }

  validateToken(token:string){
    return this.httpClient.get(`${BASE_URL}/api/auth/validate-token?token=${token}`,this.httpOptions);
  }
}
