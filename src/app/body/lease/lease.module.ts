import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaseRoutingModule } from './lease-routing.module';
import { LeaseComponent } from './lease.component';
import { NewLeaseComponent } from './lease-main/new-lease/new-lease.component';
import { LeaseMainComponent } from './lease-main/lease-main.component';
import { PersonalDetailsComponent } from './lease-main/new-lease/personal-details/personal-details.component';
import { VehicleDetailsComponent } from './lease-main/new-lease/vehicle-details/vehicle-details.component';
import {CdkStepperModule} from "@angular/cdk/stepper";
import {NgStepperModule} from "angular-ng-stepper";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DocumentsDetailsComponent } from './lease-main/new-lease/documents-details/documents-details.component';
import { GuarantorsDetailsComponent } from './lease-main/new-lease/guarantors-details/guarantors-details.component';
import { LeaseDetailsComponent } from './lease-main/new-lease/lease-details/lease-details.component';
import { PaymentsDetailsComponent } from './lease-main/new-lease/payments-details/payments-details.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonComponentsModule} from "../components/common/common.module";
import { LeaseViewComponent } from './lease-main/lease-view/lease-view.component';
import {AccordionModule} from "ngx-bootstrap/accordion";
import { LeaseDetailsPipe } from './models/lease-details.pipe';


@NgModule({
  declarations: [
    LeaseComponent,
    NewLeaseComponent,
    LeaseMainComponent,
    PersonalDetailsComponent,
    VehicleDetailsComponent,
    DocumentsDetailsComponent,
    GuarantorsDetailsComponent,
    LeaseDetailsComponent,
    PaymentsDetailsComponent,
    LeaseViewComponent,
    LeaseDetailsPipe
  ],
    imports: [
        CommonModule,
        LeaseRoutingModule,
        CdkStepperModule,
        NgStepperModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FormsModule,
        CommonComponentsModule,
        AccordionModule,
    ]
})
export class LeaseModule { }
