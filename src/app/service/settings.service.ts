import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LeaseAppSettings, NewLeaseAppSettings, NewUser, User} from "../classes/Settings";

// const BASE_URL = 'http://localhost:8080/amarasiri';
const BASE_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('le_token')
    })
  };
  constructor(private httpClient: HttpClient) { }

  getUserGroups() {
    return this.httpClient.get(`${BASE_URL}/leasing/user-group/all`, this.httpOptions);
  }

  createUserGroup(userGroupName: string, createdBy: any) {
    return this.httpClient.post(`${BASE_URL}/leasing/user-group/add?user-group-name=${userGroupName}&user-key=${createdBy}`, null, this.httpOptions);
  }

  getAllUsers() {
    return this.httpClient.get(`${BASE_URL}/leasing/all-users`, this.httpOptions);
  }


  createNewUser(payload: NewUser) {
    return this.httpClient.post(`${BASE_URL}/leasing/user/create`, payload, this.httpOptions);
  }

  getLeaseAppSettingsData() {
    return this.httpClient.get(`${BASE_URL}/leasing/lease-app-settings`, this.httpOptions);
  }
  updateLeaseAppSettings(payload:NewLeaseAppSettings){
    return this.httpClient.put(`${BASE_URL}/leasing/lease-app-settings`,payload, this.httpOptions);
  }

  deleteUserGroup(userGroupKey: number) {
    return this.httpClient.delete(`${BASE_URL}/leasing/user-group/delete?user-group-key=${userGroupKey}`,this.httpOptions);

  }

  editUserGroup(editedUserGroupName: any, selectedUserGroupKey: number, item: string | null) {
    return this.httpClient.put(`${BASE_URL}/leasing/user-group/edit?user-group-key=${selectedUserGroupKey}&user-group-name=${editedUserGroupName}&user-key=${item}`,',',this.httpOptions);
  }

  editUser(selectedUser: User) {
    return this.httpClient.put(`${BASE_URL}/leasing/user/edit`,selectedUser,this.httpOptions);

  }

  deleteUser(userKey: number) {
    return this.httpClient.delete(`${BASE_URL}/leasing/user/delete?user-key=${userKey}`,this.httpOptions);

  }
}
