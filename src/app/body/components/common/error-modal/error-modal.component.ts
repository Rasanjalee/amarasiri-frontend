import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../../../service/support-services/modal.service";
import {InterCommunicatorService} from "../../../../service/support-services/inter-communicator.service";
import {Router, Routes} from "@angular/router";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
  modalType: string = 'APPROVE';
  headerText: any = 'Success';
  subText: any = 'Successfully Created!';

  constructor(private modalService: ModalService,
              private communicationService: InterCommunicatorService,private router:Router) { }

  ngOnInit(): void {
    this.communicationService.OnUpdateErrorModal
      .subscribe((data: any)=> {
        this.modalType = data.type;
        this.headerText = data.status;
        this.subText = data.message;
      })
  }

  hideModal(modalId: string) {
    this.modalService.hideModal(modalId);
    // this.router.navigate(['/lease/main'])

  }
}
