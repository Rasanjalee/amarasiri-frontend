import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LeaseService} from "../../../../../service/lease.service";
import {LeaseeMasterDetails} from "../../../../../classes/LeaseDetails";

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  @Output() stepOneFormSubmitted = new EventEmitter<LeaseeMasterDetails>();
  public stepOneForm: FormGroup;
  profileImagePath:string = '';
  isSubmitted = false;
  newLeasePersonalDetails =  new LeaseeMasterDetails('', '', '', '', '', '', '', '');
  leaseeExist: Boolean | undefined;


  constructor(private fb: FormBuilder,
              private leaseService: LeaseService) {
    this.stepOneForm = this.fb.group({
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
      mobileNumber: this.fb.control('', Validators.required),
      landNumber: this.fb.control(''),
      nicNumber: this.fb.control('', Validators.required),
      address: this.fb.control('', Validators.required),
      remarks: this.fb.control(''),
      email: this.fb.control(''),
      coordinates: this.fb.control(''),
    });

  }

  ngOnInit(): void {

  }
  checkLeaseeExist(){
    this.leaseService.getLeaseeById(this.stepOneForm.get('nicNumber')?.value)
      .subscribe((data:any)=>{
        this.leaseeExist = data;
        console.log(this.leaseeExist)
      })

  }
  formValidation() {
    return this.stepOneForm.get('firstName')?.value !== '' &&
      this.stepOneForm.get('lastName')?.value !== '' &&
      this.stepOneForm.get('mobileNumber')?.value !== '' &&
      this.stepOneForm.get('nicNumber')?.value !== '' &&
      this.stepOneForm.get('address')?.value !== '';
  }

  submitNewLeasePersonalDetails() {
    // this.checkLeaseeExist();
    // this.leaseeExist = false
    console.log(this.leaseeExist)
    // if(this.leaseeExist==false){
      this.isSubmitted = true;
      if (this.formValidation()) {
        this.newLeasePersonalDetails = new LeaseeMasterDetails(
          this.stepOneForm.get('firstName')?.value,
          this.stepOneForm.get('lastName')?.value,
          this.stepOneForm.get('nicNumber')?.value,
          this.stepOneForm.get('mobileNumber')?.value,
          this.stepOneForm.get('landNumber')?.value,
          this.stepOneForm.get('address')?.value,
          this.profileImagePath,
          this.stepOneForm.get('email')?.value
        );
        this.stepOneFormSubmitted.emit(this.newLeasePersonalDetails);
        console.log(this.newLeasePersonalDetails)
      }
    // }

  }

  setUploadedImageUrl(imageUrl: string) {
    this.profileImagePath = imageUrl;
    console.log(imageUrl)
  }
}
