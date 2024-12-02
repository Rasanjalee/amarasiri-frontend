import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LeaseService} from "../../../service/lease.service";
import {
  LeaseDetails, LeaseDocuments,
  LeaseeMasterDetails,
  LeaseGuarantors, LeaseInstallments,
  LeaseMasterDetails,
  VehicleDetails
} from "../../../classes/LeaseDetails";
import {InterCommunicatorService} from "../../../service/support-services/inter-communicator.service";
import {ModalService} from "../../../service/support-services/modal.service";
import {LeaseInstallmentValues} from "../../../classes/NewLeaseMonthlyInstallments";

@Component({
  selector: 'app-lease-main',
  templateUrl: './lease-main.component.html',
  styleUrls: ['./lease-main.component.css']
})
export class LeaseMainComponent implements OnInit {

  allLeasesData: LeaseDetails[] = [];
  allLeasesDataLoaded = true;

  installmentPaidEffectiveDate = new Date().toISOString().slice(0, 10);
  searchTerm = '';
  selectedLeaseId: number = 0;
  installmentDueValue= 0;
  selectedLease: LeaseDetails;
  payingAmountInLinearPayment = 0;
  displayFilterSection = false;
  selectedLeaseStatus = 0;
  selectedHiddenStatus =0;
  leaseAmount=0;
  validationErrorMsg = '';
  leaseInstallmentAmounts: LeaseInstallmentValues = new LeaseInstallmentValues(0.0, 0.0, 0, 0.0);

  constructor(private router: Router,
              private leaseService: LeaseService,
              private communicationService: InterCommunicatorService,
              private modalService: ModalService) {
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
    this.selectedLease = new LeaseDetails(leaseeMaster, leaseMaster, vehicle, [guarantors], [documents], [installments], []);

  }

  ngOnInit(): void {
    this.changeLeaseHiddenStatus(0);
    this.communicationService.OnNewLeaseCreate
      .subscribe((data: boolean) => {
        if (data) {
          this.changeLeaseHiddenStatus( this.selectedHiddenStatus );
        }
      })
  }

  navigateToLeaseCreatePage() {
    this.router.navigate(['/lease/create'])
  }

  getLeasesAllDetails() {
    this.leaseService.fetchAllData(this.selectedLeaseStatus)
      .subscribe((data: any) => {
        this.allLeasesData = data;
        this.allLeasesDataLoaded = true;
      })
  }

  viewSelectedLeaseDetails(leaseDetails: LeaseDetails) {
    const json = {status: true, lease: leaseDetails};
    this.communicationService.setSelectedLeaseDetails(json);
    this.router.navigate(['/lease/details']);
  }

  isPaymentOutDated(dateTimestamp: any, isLeaseClosed: number) {
    if (dateTimestamp !== undefined && isLeaseClosed === 0) {
      return new Date().toISOString().slice(0, 10) > new Date(dateTimestamp).toISOString().slice(0, 10);
    } else {
      return false;
    }
  }

  showModal(modalId: string) {
    this.installmentPaidEffectiveDate = new Date().toISOString().slice(0, 10);
    this.modalService.showModal(modalId);
  }

  hideModal(modalId: string) {
    this.modalService.hideModal(modalId);
  }

  getInstallmentDueValue(leaseId: number) {
    this.selectedLeaseId = leaseId;
    this.calculatedInstallmentValue();
  }

  calculatedInstallmentValue() {
    this.leaseService.calculateLeaseInstallment(this.selectedLeaseId, this.installmentPaidEffectiveDate)
      .subscribe((data: any) => {
        this.leaseInstallmentAmounts = data;
        if (this.selectedLease.leaseMaster.leaseTypeKey === 3) {
          this.payingAmountInLinearPayment = Number(this.leaseInstallmentAmounts.installment.toFixed(2));
        }
      })
  }

  setSelectedLeaseDetails(lease: LeaseDetails) {
    this.selectedLease = lease;
  }

  filterSectionExpanded() {
    this.displayFilterSection = !this.displayFilterSection;
  }

  changeLeaseHiddenStatus(status:number){
    this.selectedHiddenStatus=status;

    if(status !== 2){
      this.leaseService.fetchAllData(this.selectedLeaseStatus)
        .subscribe((data: any) => {
          this.allLeasesData = data;
          this.allLeasesData = this.allLeasesData.filter(t => t.leaseMaster.isHidden === status);
          console.log(this.allLeasesData.length)
          this.allLeasesDataLoaded = true;
        })
    }else {
      this.getLeasesAllDetails();
    }
  }
  changeLeaseActiveStatus(status: number) {
    this.selectedLeaseStatus = status;
    this.getLeasesAllDetails();
  }

  payInstallment() {
    if(this.checkValidation()){

      console.log(this.leaseAmount)
      this.leaseService.payInstallment(this.selectedLeaseId,this.leaseAmount,localStorage.getItem('le_id'))
        .subscribe((data:any)=>{
          this.hideModal('leasePaymentModal');
                const json = {type: 'APPROVE', status: 'Success', message: 'Installment Pay Successfully!'}
                this.communicationService.displayErrorModal(json);
                this.showModal('confirmationModal');
                this.getLeasesAllDetails();
        }, (error: any) => {
              if (error.status === 401 || error.status === 500) {
                const json = {type: 'DECLINE', status: 'Failed', message: 'Unable to Pay Installment!'}
                this.communicationService.displayErrorModal(json);
                this.showModal('confirmationModal');
              }
            })
    }
  }

  checkValidation() {
    if (this.selectedLease.leaseMaster.leaseTypeKey === 3) {
      if (this.payingAmountInLinearPayment < (Number(this.leaseInstallmentAmounts.installment.toFixed(2)))) {
        this.validationErrorMsg = '* Paying Amount cannot be less than minimum required amount!';
        this.setErrorMessage();
        return false;
      } else {
        return true;
      }
    }else {
      return true
    }
  }

  setErrorMessage() {
    setTimeout(() => this.validationErrorMsg = '', 6000);
  }
  removeLease(id: any,status:any){
    this.leaseService.removeLeaseById(id,status)
      .subscribe((data:any)=>{
        window.location.reload();
        // const json = {type: 'APPROVE', status: 'Success', message: 'Lease Details Hide successfully!'}
        // this.communicatorService.displayErrorModal(json);
        // this.showModal('confirmationModal');
      })
  }
}
