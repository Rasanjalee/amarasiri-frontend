import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  public newUserForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.newUserForm = this.fb.group({
      firstName: this.fb.control('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

}
