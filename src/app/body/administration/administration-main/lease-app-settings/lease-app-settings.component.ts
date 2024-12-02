import { Component, OnInit } from '@angular/core';
import {LeaseAppSettings, NewLeaseAppSettings, User, UserGroup} from "../../../../classes/Settings";
import {SettingsService} from "../../../../service/settings.service";
import {data, error} from "jquery";
import {ModalService} from "../../../../service/support-services/modal.service";
import {InterCommunicatorService} from "../../../../service/support-services/inter-communicator.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-lease-app-settings',
  templateUrl: './lease-app-settings.component.html',
  styleUrls: ['./lease-app-settings.component.css']
})
export class LeaseAppSettingsComponent implements OnInit {

  leaseAppSettings :LeaseAppSettings[]=[] ;
  user:User[]=[];
  newLeaseAppSettingsData: NewLeaseAppSettings =  new NewLeaseAppSettings(0.0, 0.0,
    0.0, 0.0, 0.0, new Date(), 0,'', 0,0.0,0.0,0.0,'');
  leaseAppSettingsDataLoaded = false;


  constructor(private settingsService: SettingsService,
              private modalService:ModalService,
              private communicationService:InterCommunicatorService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getLeaseAppSettingsData();
  }

  getLeaseAppSettingsData() {
    this.settingsService.getLeaseAppSettingsData()
      .subscribe((data: any) => {
        this.leaseAppSettings.push(data);
        this.leaseAppSettings.forEach(l=>{
          console.log(l)
          this.newLeaseAppSettingsData.userName = l.user.firstName+' '+l.user.lastName;
          this.newLeaseAppSettingsData.userKey=l.user.userKey;
          this.newLeaseAppSettingsData.monthlyInterest = l.monthlyInterest;
          this.newLeaseAppSettingsData.documentCharge = l.documentCharge;
          this.newLeaseAppSettingsData.belowBenchInterestCharge = l.belowBenchInterestCharge;
          this.newLeaseAppSettingsData.aboveBenchInterestCharge =  l.aboveBenchInterestCharge;
          this.newLeaseAppSettingsData.visitCharge=l.visitCharge;
          this.newLeaseAppSettingsData.lastModifiedDateTime=l.modifiedDateTime;
          this.newLeaseAppSettingsData.benchMarkValue=l.benchMarkValue;
          this.newLeaseAppSettingsData.latePaymentInterest=l.latePaymentInterest;
          this.newLeaseAppSettingsData.delayInterestCharge=l.delayInterestCharge;
          this.newLeaseAppSettingsData.interestChangeDelayDuration=l.interestChangeDelayDuration;
          this.newLeaseAppSettingsData.earlierSettlementInterest=l.earlySettlementInterest;
        })
        this.leaseAppSettingsDataLoaded = true;
      })

  }

  updateLeaseAppSettings() {
    // window.location.reload();
    const leIdString: string | null = localStorage.getItem('le_id');

    if (leIdString!=null){
      this.newLeaseAppSettingsData.userKey = parseInt(leIdString,10)
    }
    // this.user.push(null);
    // this.leaseAppSettings.push(new LeaseAppSettings(this.newLeaseAppSettingsData.documentCharge,this.newLeaseAppSettingsData.latePaymentInterest,this.newLeaseAppSettingsData.visitCharge,this.newLeaseAppSettingsData.monthlyInterest,this.newLeaseAppSettingsData.earlierSettlementInterest,0,0,0,0,0,this.user[0],0));
    this.settingsService.updateLeaseAppSettings(this.newLeaseAppSettingsData)
      .subscribe((data: any) => {
        console.log('dddd')
        const json = {type: 'APPROVE', status: 'Success', message: 'Lease App Setting Successfully Updated!'}
        this.communicationService.displayErrorModal(json);
        this.showModal('confirmationModal');
        this.getLeaseAppSettingsData();
        console.log(data);
      }, (error: HttpErrorResponse) => {
        if (error.status === 200 ) {
          const json = {type: 'APPROVE', status: 'Success', message: 'Lease App Setting Successfully Updated!'}
          this.communicationService.displayErrorModal(json);
          this.showModal('confirmationModal');
          this.getLeaseAppSettingsData();
        } else {
          const json = {type: 'DECLINE', status: 'Failed', message: 'Failed to update details!'}
          this.communicationService.displayErrorModal(json);
          this.showModal('confirmationModal');
        }
      });

  }
  showModal(modalId: string) {
    this.modalService.showModal(modalId);
  }

  getModifiedDateTime(lastModifiedDateTime: any) {
    const dateObject = new Date(lastModifiedDateTime);
    return this.datePipe.transform(dateObject, 'yyyy-MM-dd HH:mm:ss');
  }
}
