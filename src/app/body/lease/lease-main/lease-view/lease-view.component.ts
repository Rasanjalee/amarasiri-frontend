import { Component, OnInit } from '@angular/core';
import {InterCommunicatorService} from "../../../../service/support-services/inter-communicator.service";
import {
  LeaseDetails,
  LeaseDocuments,
  LeaseeMasterDetails, LeaseGuarantors, LeaseInstallments,
  LeaseMasterDetails, LeasePaymentHistory,
  VehicleDetails
} from "../../../../classes/LeaseDetails";
import {Router} from "@angular/router";
import {LeaseService} from "../../../../service/lease.service";
import {ModalService} from "../../../../service/support-services/modal.service";
import {data, error} from "jquery";
import {LeaseInstallmentValues} from "../../../../classes/NewLeaseMonthlyInstallments";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-lease-view',
  templateUrl: './lease-view.component.html',
  styleUrls: ['./lease-view.component.css']
})
export class LeaseViewComponent implements OnInit {

  selectedLeaseDetails: LeaseDetails;
  selectedLeaseDetailsDataFetched: boolean;
  selectedSectionToEdit: string = '';
  selectedLease: LeaseDetails;

  selectedLeaseId: number = 0;
  installmentPaidEffectiveDate = new Date().toISOString().slice(0, 10);
  leaseInstallmentAmounts: LeaseInstallmentValues = new LeaseInstallmentValues(0.0, 0.0, 0, 0.0);
  payingAmountInLinearPayment = 0;
  leaseAmount=0;
  validationErrorMsg = '';
  newLandNumber: any;
  newEmail: any;

  docToSave:any =[];
  showFullScreen: boolean = false;
  fullscreenImage: string = '';

  constructor(private communicatorService: InterCommunicatorService,
              private leaseService: LeaseService,
              private modalService: ModalService,
              private communicationService: InterCommunicatorService,
              private router: Router,
              private sanitizer: DomSanitizer) {

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
    const paymentHistory = new LeasePaymentHistory('', '');
    this.selectedLeaseDetails = new LeaseDetails(leaseeMaster, leaseMaster, vehicle, [guarantors], [documents], [installments], [paymentHistory]);

    this.selectedLease = new LeaseDetails(leaseeMaster, leaseMaster, vehicle, [guarantors], [documents], [installments], []);

    this.selectedLeaseDetailsDataFetched = false;
  }

  ngOnInit(): void {
    this.communicatorService.selectedLeaseDetailsUpdate
      .subscribe((data: {status: boolean, lease: LeaseDetails}) => {
        if (data.status) {
          this.selectedLeaseDetails =  data.lease;
          console.log(this.selectedLeaseDetails)
          this.selectedLeaseDetailsDataFetched = true;
        } else {
          this.router.navigate(['/lease/main']);
        }
      })

    this.newEmail=this.selectedLeaseDetails.leaseeMaster.email;
    this.newLandNumber=this.selectedLeaseDetails.leaseeMaster.homeNumber;
  }

  handleImageClick(event: any) {
    const clickedElement = event.target;
    console.log(clickedElement.getAttribute('alt'))
    if (clickedElement.tagName === 'IMG') {
      if(clickedElement.getAttribute('alt')==='uploaded-doc'){
        const imageUrl = clickedElement.getAttribute('src');
        this.openFullScreen(imageUrl);
      }
    }
  }
  openFullScreen(imageUrl: string) {
    this.fullscreenImage = imageUrl;
    this.showFullScreen = true;
  }

  closeFullScreen() {
    this.showFullScreen = false;
    this.fullscreenImage = '';
  }

  backToLeaseMainPage() {
    this.router.navigate(['/lease/main']);
  }

  editSectionEnabled(section: string) {
    this.selectedSectionToEdit = section;
  }

  editLeaseGuarantorsDetails() {
    this.leaseService.editLeaseGuarantorsDetails(this.selectedLeaseDetails.leaseGurantors)
      .subscribe((data: any) => {
        this.editSectionEnabled('');
        const json = {type: 'APPROVE', status: 'Success', message: 'Guarantors Details edit successfully!'}
        this.communicatorService.displayErrorModal(json);
        this.showModal('confirmationModal');
      })
  }

  showModal(modalId: string) {
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

  payInstallment() {
    if(this.checkValidation()){

      this.leaseService.payInstallment(this.selectedLeaseId,this.leaseAmount,localStorage.getItem('le_id'))
        .subscribe((data:any)=>{
          this.hideModal('leasePaymentModal');
          const json = {type: 'APPROVE', status: 'Success', message: 'Installment Pay Successfully!'}
          this.communicationService.displayErrorModal(json);
          this.showModal('confirmationModal');
          this.selectedLeaseDetails.leasePaymentHistories.push({
            paymentdateTime:new Date(),paymentAmount:this.leaseAmount
          })
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

  editPersonalData() {
    this.leaseService.editPersonalDetails(this.selectedLeaseDetails.leaseMaster.leaseKey,this.newLandNumber,this.newEmail)
      .subscribe((data:any)=>{
        console.log(data)
      },(error:any)=>{
        if(error.status==200){
          this.editSectionEnabled('');
          const json = {type: 'APPROVE', status: 'Success', message: 'Personal Details edit successfully!'}
          this.communicatorService.displayErrorModal(json);
          this.showModal('confirmationModal');
        }
      });
  }
  safeImageUrl(doc:any): SafeResourceUrl {
    // Use DomSanitizer to sanitize the URL
    let documents = this.selectedLeaseDetails.leaseDocuments.filter(value => value.documentName==doc);
    return this.sanitizer.bypassSecurityTrustResourceUrl( documents[0].documentPath);
  }

  checkImageAvailable(type: string) {
    return !this.selectedLeaseDetails.leaseDocuments.some(value => value.documentName === type);


  }
  setUploadedImageUrl(docUrl: string, docType: string) {
    const document = new LeaseDocuments(docType, docUrl);
    console.log(document)
    this.docToSave.push(document);
  }


  saveDocs(leaseKey: number) {
    this.leaseService.saveDocuments({leaseKey:leaseKey,docList:this.docToSave})
      .subscribe((data:any)=>{
        this.docToSave = [];

    },(error:any)=>{
      if (error.status === 200 ) {
        this.docToSave = [];

      }

  })
}
}
