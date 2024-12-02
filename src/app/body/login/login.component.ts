import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {InterCommunicatorService} from "../../service/support-services/inter-communicator.service";
import {LoginService} from "../../service/login.service";
import {Profile} from "../../classes/Profile";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validationErrorMessage: string =   '';
  constructor(private router: Router,
              private communicationService: InterCommunicatorService,
              private loginService: LoginService) { }

  ngOnInit(): void {
    localStorage.clear();
  }

  formValidation() {
    if ((<HTMLInputElement>document.getElementById('userNameToLogin')).value == '' ||
      (<HTMLInputElement>document.getElementById('passwordToLogin')).value == 'null' ) {
      this.setErrorMessage('Username or Password invalid');
      return false;
    } else {
      return true;
    }
  }

  // loginToSystem() {
  //   if (this.formValidation()) {
  //     const json = {
  //       username: (<HTMLInputElement>document.getElementById('userNameToLogin')).value,
  //       password: (<HTMLInputElement>document.getElementById('passwordToLogin')).value
  //     }
  //
  //     this.loginService.loginToSystem(json)
  //       .subscribe(
  //         (data: any) => {
  //           localStorage.setItem('le_token', data.token);
  //           localStorage.setItem('le_id', data.id);
  //           localStorage.setItem('le_name', data.firstName + ' ' + data.lastName);
  //           localStorage.setItem('le_email', data.email);
  //           this.communicationService.changeHeaderNavBarStatus(false);
  //           this.router.navigate(['./lease']);
  //           setTimeout(() => {
  //             this.router.navigate(['./lease']);
  //           }, 2000)
  //         },
  //         (error: any) => {
  //           if (error.status === 401) {
  //             // Handle unauthorized error (e.g., redirect to a login page)
  //             console.error('Unauthorized access:', error);
  //             this.setErrorMessage("User Name or Password Invalid");
  //           } else {
  //             // Handle other types of errors
  //             console.error('An error occurred:', error);
  //           }
  //         }
  //       );
  //   }
  //
  // }

  loginToSystem() {
    if (this.formValidation()) {
      const json = {
        username: (<HTMLInputElement>document.getElementById('userNameToLogin')).value,
        password: (<HTMLInputElement>document.getElementById('passwordToLogin')).value
      }

      this.loginService.loginToSystem(json)
        .subscribe(
          (data: any) => {
            Profile.PROFILE_TOKEN = data.token;
            // Store user data in localStorage
            localStorage.setItem('le_token', data.token);
            localStorage.setItem('le_id', data.id);
            localStorage.setItem('le_name', data.firstName + ' ' + data.lastName);
            localStorage.setItem('le_email', data.email);

            // Notify other parts of the application about the successful login
            this.communicationService.changeHeaderNavBarStatus(false);

            // Navigate to the 'lease' route after setting the localStorage

            // Delay the navigation to '/lease' by 1 second
            if (localStorage.getItem('le_token') !== null && localStorage.getItem('le_token') !== undefined) {
                this.router.navigate(['./lease']);
            }
          },
          (error: any) => {
            if (error.status === 401) {
              // Handle unauthorized error (e.g., redirect to a login page)
              console.error('Unauthorized access:', error);
              this.setErrorMessage("User Name or Password Invalid");
            } else {
              // Handle other types of errors
              console.error('An error occurred:', error);
            }
          }
        );
    }
  }

  setErrorMessage(msg: string) {
    this.validationErrorMessage = msg;
    setTimeout(() => this.validationErrorMessage = '', 4000);
  }
}
