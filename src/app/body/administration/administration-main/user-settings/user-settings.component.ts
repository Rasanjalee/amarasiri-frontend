import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../../../service/support-services/modal.service";
import {SettingsService} from "../../../../service/settings.service";
import {NewUser, User, UserGroup} from "../../../../classes/Settings";
import {LoginService} from "../../../../service/login.service";
import {InterCommunicatorService} from "../../../../service/support-services/inter-communicator.service";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  allUsers: User[] = [];
  allUsersDataLoaded = false;
  userSearchTerm: any = '';
  user = new NewUser('', '', '', '', '', 0, '', '', '',
    '', 1, '', 1, 0);
  allUserGroups: UserGroup[] = [];
  reEnterPwd: any;
  passwordsNotMatch: boolean = false;
  validationErrorMsg = '';
  selectedUser = new User('', '', '', '', '', 0, 0, '', '',
    '', 1, '', new UserGroup(0,''), 0,0);
  // = new NewUser('', '', '', '', '', 0, '', '', '',
  //   '', 1, '', 1, 0);
  loginMail: any;

  constructor(private modalService: ModalService,
              private settingsService: SettingsService,private communicationService:InterCommunicatorService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllUserGroups();
    this.loginMail = localStorage.getItem('le_email')
  }

  getAllUserGroups() {
    this.settingsService.getUserGroups()
      .subscribe((data: any) => {
        if(data.length > 0) {
          this.allUserGroups =  data;
          this.user.userGroupKey = data[0].userGroupKey;
          console.log(this.allUserGroups);
        }
      });
  }

  getAllUsers() {
    this.settingsService.getAllUsers()
      .subscribe((data: any) => {
        this.allUsers = data;
        this.allUsersDataLoaded = true;
      })
  }

  checkPasswordMatch() {
    this.passwordsNotMatch = this.reEnterPwd !== this.user.password;
  }

  createNewUser() {
    this.showModal('createNewUser')
  }

  showModal(modalID: string){
    this.modalService.showModal(modalID);
  }

  hideModal(modalID: string) {
    this.modalService.hideModal(modalID)
  }

  addNewUserToList() {
    if (this.formValidation()) {
      this.settingsService.createNewUser(this.user)
        .subscribe((data: any) => {
          this.hideModal('createNewUser');
          this.allUsersDataLoaded = false;
          this.getAllUsers();
        });
    }
  }

  formValidation() {
    if (this.user.firstName === '' || this.user.lastName === '' || this.user.password === '' ||
    this.user.mobileNumber === ''|| this.user.identificationNumber === '' || this.user.username === '' ||
    this.user.address === '') {
      this.validationErrorMsg = '*Please fill all required fields!';
      setTimeout(() => this.validationErrorMsg = '', 3000);
      return false;
    } else {
      return true;
    }
  }

  saveUserToList() {
    this.settingsService.editUser(this.selectedUser)
      .subscribe((data:any)=>{

        this.hideModal('editUser')
        const json = {type: 'APPROVE', status: 'Success', message: 'User Details Successfully Updated!'}
        this.communicationService.displayErrorModal(json);
        this.showModal('confirmationModal');
        this.allUsersDataLoaded = false;

        this.getAllUsers();
      })

  }

  selectUser(data: User) {
    // console.log(data)
    // this.selectedUser.firstName = data.firstName;
    // this.selectedUser.lastName = data.lastName;
    // this.selectedUser.userGroup.userGroupKey = data.userGroup.userGroupKey;
    // this.selectedUser.mobileNumber =data.mobileNumber;
    // this.selectedUser.loginId = data.loginId;
    this.selectedUser=data
    // this.selectedUser = data;

  }

  showModalDelete(deleteUserModal: string) {
    this.showModal(deleteUserModal);

  }

  deleteUser() {

    this.settingsService.deleteUser(this.selectedUser.userKey)
      .subscribe((data:any)=>{
        this.hideModal('deleteUserModal')
        this.getAllUsers();
      })
  }
}
