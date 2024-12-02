import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administration-main',
  templateUrl: './administration-main.component.html',
  styleUrls: ['./administration-main.component.css']
})
export class AdministrationMainComponent implements OnInit {

  tabName: string = 'userSettings';
  subHeaderOfBreadCrumb: string = 'User';

  constructor() { }

  ngOnInit(): void {
  }

  changeActiveTab(activeTab: string) {
    switch (activeTab) {
      case 'userSettings': this.subHeaderOfBreadCrumb = 'User';
      break;
      case 'groupSettings': this.subHeaderOfBreadCrumb = 'User Group';
      break;
      case 'leaseSettings': this.subHeaderOfBreadCrumb = 'Lease App';
      break;

    }
    this.tabName = activeTab;
  }
}
