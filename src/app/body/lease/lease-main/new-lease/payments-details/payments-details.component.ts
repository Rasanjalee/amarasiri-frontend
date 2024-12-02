import { Component, OnInit } from '@angular/core';
import {InterCommunicatorService} from "../../../../../service/support-services/inter-communicator.service";
import {NewLeaseMonthlyInstallments, NewLeasePaymentsDetails} from "../../../../../classes/NewLeaseMonthlyInstallments";
import {LeaseInstallments} from "../../../../../classes/LeaseDetails";

@Component({
  selector: 'app-payments-details',
  templateUrl: './payments-details.component.html',
  styleUrls: ['./payments-details.component.css']
})
export class PaymentsDetailsComponent implements OnInit {

  newLeasePaymentAmounts: NewLeaseMonthlyInstallments = new NewLeaseMonthlyInstallments('', '', '', '', '', '', '', '', '',0,0.0,0.0);
  newLeasePaymentAmountsLoaded = false;
  monthlyPaymentDetails: LeaseInstallments[] = [];

  constructor(private communicatorService: InterCommunicatorService) { }

  ngOnInit(): void {
    console.log('dddd')
    this.communicatorService.currentActiveNewLeasePayments
      .subscribe((data: {status: boolean, paymentHistory: LeaseInstallments[], lease: NewLeaseMonthlyInstallments}) => {
        console.log('fffff')
        console.log(data)
        if (data.status) {
          console.log('ffff')
          this.monthlyPaymentDetails = data.paymentHistory;
          this.newLeasePaymentAmounts =  data.lease;
          this.newLeasePaymentAmountsLoaded = true;
        }
      })
  }
}
