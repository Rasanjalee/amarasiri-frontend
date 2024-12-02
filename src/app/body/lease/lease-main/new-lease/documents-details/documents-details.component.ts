import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LeaseDocuments} from "../../../../../classes/LeaseDetails";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-documents-details',
  templateUrl: './documents-details.component.html',
  styleUrls: ['./documents-details.component.css']
})
export class DocumentsDetailsComponent implements OnInit {

  @Output() leaseDocumentFormSubmit = new EventEmitter<LeaseDocuments[]>();
  leaseDocuments: LeaseDocuments[];
  constructor() {
    const documents = new LeaseDocuments('', '');
    this.leaseDocuments = [documents];
  }

  ngOnInit(): void {
  }

  setUploadedImageUrl(docUrl: string, docType: string) {
    const document = new LeaseDocuments(docType, docUrl);
    console.log(document)
    this.leaseDocuments.push(document);
  }

  submitLeaseDocuments() {
    this.leaseDocumentFormSubmit.emit(this.leaseDocuments);
  }
}
