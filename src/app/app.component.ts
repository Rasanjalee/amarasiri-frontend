import {Component, OnChanges, OnInit} from '@angular/core';
import {InterCommunicatorService} from "./service/support-services/inter-communicator.service";
import {LoginService} from "./service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  token:any;
  hideHeaderNavBar = false
  private isValidToken: any;
  appLoaded: boolean = false;
  constructor(private communicatorService: InterCommunicatorService,
              private loginService: LoginService,
              private router:Router) {
  }

  ngOnInit() {
    if (new Date().toISOString().slice(0, 10) < '2024-12-05') {

      if (window.location.href.includes('/login')){
        this.communicatorService.changeHeaderNavBarStatus(true);
      } else {
        this.communicatorService.changeHeaderNavBarStatus(false);
      }

      this.token = localStorage.getItem('le_token');
      this.loginService.validateToken(this.token)
        .subscribe(
          (response: any) => {
            // Handle successful response if needed
          },
          (error: any) => {
            console.log(error);
            if (error.status === 401) {
              this.communicatorService.changeHeaderNavBarStatus(true);
              this.router.navigate(['/login']);
            }
          }
        );

      this.communicatorService.updateStatusOfNavBar
        .subscribe((data: boolean) => {
          this.hideHeaderNavBar = data;
        })
      this.appLoaded = true;
    }
  }
}
