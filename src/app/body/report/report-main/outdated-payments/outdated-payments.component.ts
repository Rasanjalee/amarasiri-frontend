import { Component, OnInit } from '@angular/core';
import {LeaseService} from "../../../../service/lease.service";

@Component({
  selector: 'app-outdated-payments',
  templateUrl: './outdated-payments.component.html',
  styleUrls: ['./outdated-payments.component.css']
})
export class OutdatedPaymentsComponent implements OnInit {

  startDate: any;
  endDate: any;
  dateFiltersApplied: boolean = false;
  paymentsData: any;
  paymentsDataLoaded: boolean = false;

  constructor(private leaseService: LeaseService) {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.startDate = startOfMonth.toISOString().split('T')[0];
    this.endDate = endOfMonth.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getOutDatedData();
  }

  getOutDatedData() {
    this.leaseService.getOutDatedPaymentsDetails()
      .subscribe((data: any) => {
        console.log(data)
        this.paymentsData = data;
        this.paymentsDataLoaded = true;
      })
  }

  dateFilterChecked() {
    this.dateFiltersApplied = !this.dateFiltersApplied;
  }
}
