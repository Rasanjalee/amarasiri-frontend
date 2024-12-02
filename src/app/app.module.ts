import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './body/header/header.component';
import {LeaseModule} from "./body/lease/lease.module";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InterCommunicatorService} from "./service/support-services/inter-communicator.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {AdministrationModule} from "./body/administration/administration.module";
import { ReportComponent } from './body/report/report.component';
import {ReportModule} from "./body/report/report.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    LeaseModule,
    AdministrationModule,
    ReportModule,
    BrowserAnimationsModule,
  ],
  providers: [InterCommunicatorService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
