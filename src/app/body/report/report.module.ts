import {NgModule} from "@angular/core";
import { ReportMainComponent } from './report-main/report-main.component';
import {CommonModule} from "@angular/common";
import {IncomeComponent} from "./report-main/income/income.component";
import { OutdatedPaymentsComponent } from './report-main/outdated-payments/outdated-payments.component';
import { PayslipsComponent } from './report-main/payslips/payslips.component';
import {RouterModule} from "@angular/router";
import {ReportRoutingModule} from "./report-routing.module";
import { CustomReportComponent } from './report-main/income/custom-report/custom-report.component';
import { SummaryReportComponent } from './report-main/income/summary-report/summary-report.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ReportMainComponent,
    IncomeComponent,
    OutdatedPaymentsComponent,
    PayslipsComponent,
    CustomReportComponent,
    SummaryReportComponent
  ],
  imports: [
    CommonModule, RouterModule, ReportRoutingModule, FormsModule
  ]
})
export class ReportModule { }
