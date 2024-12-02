import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NewLeaseMonthlyInstallments, NewLeasePaymentsDetails} from "../../classes/NewLeaseMonthlyInstallments";
import {LeaseDetails, LeaseInstallments} from "../../classes/LeaseDetails";

@Injectable()
export class InterCommunicatorService {

  private hideHeaderNavBarOnLogin = new BehaviorSubject<boolean>(false);
  updateStatusOfNavBar = this.hideHeaderNavBarOnLogin.asObservable();

  private newLeasePayments = new BehaviorSubject<any>({status: false, paymentHistory: [], lease: NewLeaseMonthlyInstallments});
  currentActiveNewLeasePayments =this.newLeasePayments.asObservable();

  private selectedLeaseDetails = new BehaviorSubject<any>({'status': false, 'lease': LeaseDetails});
  selectedLeaseDetailsUpdate = this.selectedLeaseDetails.asObservable();

  private newLeaseCreate = new BehaviorSubject<boolean>(false);
  OnNewLeaseCreate= this.newLeaseCreate.asObservable();

  private errorModal = new BehaviorSubject<any>({type: '', status: '', message: ''});
  OnUpdateErrorModal = this.errorModal.asObservable();

  constructor() { }

  changeHeaderNavBarStatus(status:boolean) {
    this.hideHeaderNavBarOnLogin.next(status);
  }

  setCurrentActiveNewLeasePayments(json: {status: boolean, paymentHistory: LeaseInstallments[], lease: NewLeaseMonthlyInstallments}) {
    this.newLeasePayments.next(json);
  }

  setSelectedLeaseDetails(leaseObj: {status: boolean, lease: LeaseDetails}) {
    this.selectedLeaseDetails.next(leaseObj);
  }

  createNewLease(status: boolean) {
    this.newLeaseCreate.next(status);
  }

  displayErrorModal(json: any) {
    this.errorModal.next(json);
  }
}
