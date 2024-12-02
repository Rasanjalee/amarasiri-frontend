import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
  LeaseDetails,
  LeaseDocuments,
  LeaseeMasterDetails, LeaseGuarantors, LeaseInstallments,
  LeaseMasterDetails,
  VehicleDetails
} from "../../../../classes/LeaseDetails";
import {LeaseService} from "../../../../service/lease.service";
import {InterCommunicatorService} from "../../../../service/support-services/inter-communicator.service";
import {ModalService} from "../../../../service/support-services/modal.service";
import {Router} from "@angular/router";
import {NewLeaseMonthlyInstallments} from "../../../../classes/NewLeaseMonthlyInstallments";

@Component({
  selector: 'app-new-lease',
  templateUrl: './new-lease.component.html',
  styleUrls: ['./new-lease.component.css']
})
export class NewLeaseComponent implements OnInit {

  newLeaseDetails: LeaseDetails;

  selectedSection = 1;
  isNewLeaseCreated: boolean = false;
  constructor(private _formBuilder: FormBuilder,
              private leaseService: LeaseService,
              private communicationService: InterCommunicatorService,
              private modalService: ModalService,
              private router: Router) {


    // Create instances of the required classes here
    const leaseeMaster = new LeaseeMasterDetails('', '', '', '', '', '', '', '');
    const leaseMaster = new LeaseMasterDetails(0, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '',
      '', 0, '', '', '', '',  '', '', '','');;
    const vehicle = new VehicleDetails('', '', '', '', '', '', '', '', '');
    const documents = new LeaseDocuments('', '');
    const guarantors =  new LeaseGuarantors('', '', '', '');
    const installments = new LeaseInstallments(0, '', '', '', '', '', '',
      '', '');
    this.newLeaseDetails = new LeaseDetails(leaseeMaster, leaseMaster, vehicle, [guarantors], [documents], [installments], []);
  }

  ngOnInit(): void {
  }

  changeSteps(number: number) {
   this.selectedSection = number;
  }

  submitLeasePersonalDetails(details: LeaseeMasterDetails) {
    console.log(details)
    this.newLeaseDetails.leaseeMaster = details;
  }

  submitLeaseVehicleDetails(details: VehicleDetails) {
    this.newLeaseDetails.vehicle = details;
  }

  submitLeaseDocumentsDetails(details: LeaseDocuments[]){
    this.newLeaseDetails.leaseDocuments = details;
  }

  submitLeaseGuarantorsDetails(details: LeaseGuarantors[]) {
    this.newLeaseDetails.leaseGurantors = details;
  }

  submitLeasePaymentsDetails(detail: { leaseMaster: LeaseMasterDetails; installment: LeaseInstallments[], monthlyPayments: any }) {
    this.newLeaseDetails.leaseMaster =  detail.leaseMaster;
    this.newLeaseDetails.installments = detail.installment;
    console.log(this.newLeaseDetails)
    console.log("---------------------------")
    this.leaseService.createNewLease(this.newLeaseDetails)
      .subscribe( (data: any) => {
        console.log(data);
        this.communicationService.createNewLease(true);

        const leaseFinal: NewLeaseMonthlyInstallments = new NewLeaseMonthlyInstallments('', '', '', '', '', '', '', '', '',0,0.0,0.0);
        leaseFinal.totalLeaseCost = detail.leaseMaster.totalLeaseCost;
        leaseFinal.totalInterest = detail.leaseMaster.totalInterest;
        leaseFinal.installment = detail.leaseMaster.installment;
        const leaseJson = {status: true, paymentHistory: detail.installment, lease: leaseFinal}
        this.communicationService.setCurrentActiveNewLeasePayments(leaseJson);
        this.isNewLeaseCreated = true;
        const json = {type: 'APPROVE', status: 'Success', message: 'New Lease Created Successfully!'}
        this.communicationService.displayErrorModal(json);
        this.showModal('confirmationModal');
      },(error: any) => {
        console.log(error)
        if (error.status === 401 || error.status === 500 || error.status === 0) {
          this.isNewLeaseCreated = false;
          const json = {type: 'DECLINE', status: 'Failed', message: 'Unable to Create New Lease!'}
          this.communicationService.displayErrorModal(json);
          this.showModal('confirmationModal');
        } else if(error.status === 200) {
          this.isNewLeaseCreated = true;
          this.communicationService.createNewLease(true);

          const leaseFinal: NewLeaseMonthlyInstallments = new NewLeaseMonthlyInstallments('', '', '', '', '', '', '', '', '',0,0.0,0.0);
          leaseFinal.totalLeaseCost = detail.leaseMaster.totalLeaseCost;
          leaseFinal.totalInterest = detail.leaseMaster.totalInterest;
          leaseFinal.installment = detail.leaseMaster.installment;
          const leaseJson = {status: true, paymentHistory: detail.installment, lease: leaseFinal}
          this.communicationService.setCurrentActiveNewLeasePayments(leaseJson);
          this.isNewLeaseCreated = true;
          const json = {type: 'APPROVE', status: 'Success', message: 'New Lease Created Successfully!'}
          this.communicationService.displayErrorModal(json);
          this.showModal('confirmationModal');
        }
      })
  }

  showModal(modalId: string) {
    this.modalService.showModal(modalId);
  }

  navigateToHomePage() {
    this.router.navigate(['./lease']);
  }
}
