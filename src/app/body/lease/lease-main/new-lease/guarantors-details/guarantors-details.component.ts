import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LeaseGuarantors} from "../../../../../classes/LeaseDetails";

@Component({
  selector: 'app-guarantors-details',
  templateUrl: './guarantors-details.component.html',
  styleUrls: ['./guarantors-details.component.css']
})
export class GuarantorsDetailsComponent implements OnInit {

  @Output() stepFourFormSubmitted = new EventEmitter<LeaseGuarantors[]> ();
  leaseGuarantors: LeaseGuarantors[] = [];
  isSubmitted = false;
  public stepFourForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.stepFourForm = this.fb.group({
      guarantorOneForm: this.fb.group( {
        name: this.fb.control('', Validators.required),
        address: this.fb.control(''),
        nic: this.fb.control(''),
        phone: this.fb.control('')
      }),
      guarantorTwoForm: this.fb.group( {
        name: this.fb.control('', Validators.required),
        address: this.fb.control(''),
        nic: this.fb.control(''),
        phone: this.fb.control('')
      }),
    })
  }

  ngOnInit(): void {
  }

  submitNewLeaseGuarantorsDetails() {
    const guarantorOne = new LeaseGuarantors(
      this.stepFourForm.get('guarantorOneForm.name')?.value,
      this.stepFourForm.get('guarantorOneForm.nic')?.value,
      this.stepFourForm.get('guarantorOneForm.phone')?.value,
    this.stepFourForm.get('guarantorOneForm.address')?.value
    );
    const guarantorTwo = new LeaseGuarantors(
      this.stepFourForm.get('guarantorTwoForm.name')?.value,
      this.stepFourForm.get('guarantorTwoForm.nic')?.value,
      this.stepFourForm.get('guarantorTwoForm.phone')?.value,
    this.stepFourForm.get('guarantorTwoForm.address')?.value
    );
    this.leaseGuarantors.push(guarantorOne);
    this.leaseGuarantors.push(guarantorTwo);
    this.stepFourFormSubmitted.emit(this.leaseGuarantors);
    this.isSubmitted = true;
  }
}
