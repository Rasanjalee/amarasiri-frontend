import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VehicleDetails} from "../../../../../classes/LeaseDetails";

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  @Output() stepTwoFormSubmitted = new EventEmitter<VehicleDetails>();
  vehicleImageUrl: string = '';
  isSubmitted = false;
  public stepTwoForm: FormGroup;

  newLeaseVehicleDetails = new VehicleDetails('', '', '', '', '', '', '', '', '');


  constructor(private fb: FormBuilder) {
    this.stepTwoForm = this.fb.group({
      vehicleNo: this.fb.control('', Validators.required),
      chassisNo: this.fb.control('', Validators.required),
      engineNo: this.fb.control('', Validators.required),
      make: this.fb.control('', Validators.required),
      model: this.fb.control('', Validators.required),
      manufactureYear: this.fb.control('', Validators.required),
      registerYear: this.fb.control('', Validators.required),
      noOfOwners: this.fb.control('', Validators.required),
      remarks: this.fb.control(''),
    });
  }

  ngOnInit(): void {
  }

  setUploadedImageUrl(imageUrl: string) {
    this.vehicleImageUrl = imageUrl;
  }

  formValidation() {
    return this.stepTwoForm.get('vehicleNo')?.value !== '' &&
      this.stepTwoForm.get('chassisNo')?.value !== '' &&
      this.stepTwoForm.get('engineNo')?.value !== '' &&
      this.stepTwoForm.get('make')?.value !== '' &&
      this.stepTwoForm.get('model')?.value !== '' &&
      this.stepTwoForm.get('manufactureYear')?.value !== '' &&
      this.stepTwoForm.get('registerYear')?.value !== '' &&
      this.stepTwoForm.get('noOfOwners')?.value !== ''
  }

  submitNewLeaseVehicleDetails() {
    this.isSubmitted = true;
    if (this.formValidation()) {
      this.newLeaseVehicleDetails = new VehicleDetails(
        this.stepTwoForm.get('vehicleNo')?.value,
        this.stepTwoForm.get('chassisNo')?.value,
        this.stepTwoForm.get('make')?.value,
        this.stepTwoForm.get('model')?.value,
        this.stepTwoForm.get('manufactureYear')?.value,
        this.stepTwoForm.get('registerYear')?.value,
        this.stepTwoForm.get('noOfOwners')?.value,
        this.stepTwoForm.get('engineNo')?.value,
        this.vehicleImageUrl
      );
      this.stepTwoFormSubmitted.emit(this.newLeaseVehicleDetails);
    }
  }
}
