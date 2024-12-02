import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../../service/settings.service";
import {ModalService} from "../../../../service/support-services/modal.service";

@Component({
  selector: 'app-user-group-settings',
  templateUrl: './user-group-settings.component.html',
  styleUrls: ['./user-group-settings.component.css']
})
export class UserGroupSettingsComponent implements OnInit {

  userGroups: any = [];
  userGroupsDataLoaded: boolean = false;
  newUserGroupName: string = '';
  userGroupSearchTerm: any = '';
  deleteGroupName:any='';
  selectedUserGroupName:any='';
  selectedUserGroupKey: number=0;
  error: boolean=false;
  editedUserGroupName: any='';
  constructor(private settingsService: SettingsService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.error=false;
    this.getAllUserGroups();
  }

  getAllUserGroups() {
    this.error=false;
    this.settingsService.getUserGroups()
      .subscribe( (data: any) => {
        this.userGroups = data;
        this.userGroupsDataLoaded = true;
      })
 }

  createNewUserGroup() {
    this.error=false
    this.settingsService.createUserGroup(this.newUserGroupName, localStorage.getItem('le_id'))
      .subscribe((data: any) => {
        console.log("creATE")
        this.hideModal('newUserGroupModal');
        this.userGroupsDataLoaded = false;
        this.getAllUserGroups();
      });
  }

  showModal(modalID: string) {

    this.error=false;
    this.modalService.showModal(modalID);
  }

  showModalDelete(modalID: string,userGroup:string,key:number) {
this.error=false;
    this.selectedUserGroupName=userGroup;
    this.selectedUserGroupKey=key;
    this.modalService.showModal(modalID);
  }
  hideModal(modalID: string) {
    this.modalService.hideModal(modalID);
  }

  editUserGroup() {

    this.showModal('editUserGroupModal');
  }

  deleteUserGroup(userGroupName:any,userGroupKey:number) {
    // this.hideModal('newUserGroupModal');
    this.error=false;
    if(this.selectedUserGroupName==userGroupName){
      this.settingsService.deleteUserGroup(userGroupKey)
        .subscribe((data: any) => {
          this.hideModal('confirmDeleteUserGroupModal');
          this.userGroupsDataLoaded = false;
          this.getAllUserGroups();
        });

    }
    else {
      this.error=true;
    }



  }

  selectUserGroupName(userGroupName: any, userGroupKey: any) {
    this.selectedUserGroupName=userGroupName;
    this.selectedUserGroupKey=userGroupKey;
  }

  saveUserGroup(editedUserGroupName: any, selectedUserGroupKey: number) {
    this.settingsService.editUserGroup(editedUserGroupName,selectedUserGroupKey,localStorage.getItem('le_id'))
      .subscribe((data:any)=>{

      })
  }
}
