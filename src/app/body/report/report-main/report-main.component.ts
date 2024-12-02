import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-main',
  templateUrl: './report-main.component.html',
  styleUrls: ['./report-main.component.css']
})
export class ReportMainComponent implements OnInit {
  tabName: string = 'income';
  subHeaderOfBreadCrumb: string = 'Income / Custom';
  constructor() { }

  ngOnInit(): void {
  }
  changeActiveTab(activeTab: string) {
    switch (activeTab) {
      case 'income': this.subHeaderOfBreadCrumb = 'Income / Custom';
        break;
      case 'outdatedPayments': this.subHeaderOfBreadCrumb = 'Outdated Payments';
        break;
      case 'paySlips': this.subHeaderOfBreadCrumb = 'Pay Slips';
        break;

    }
    this.tabName = activeTab;
  }
}
