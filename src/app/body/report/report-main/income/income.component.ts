import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {

  selectedTab: string = 'custom';
  constructor() { }

  ngOnInit(): void {
  }

  changeActiveTab(tab: string) {
    this.selectedTab = tab;
  }

}
