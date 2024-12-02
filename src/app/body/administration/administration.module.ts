import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { AdministrationComponent } from './administration.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UserSearchViewComponent } from './user-search-view/user-search-view.component';
import {RouterModule} from "@angular/router";
import {AdministrationRoutingModule} from "./administration-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdministrationMainComponent} from "./administration-main/administration-main.component";
import { UserSettingsComponent } from './administration-main/user-settings/user-settings.component';
import { UserGroupSettingsComponent } from './administration-main/user-group-settings/user-group-settings.component';
import { UserGroupPipe } from './models/user-group.pipe';
import { UserPipe } from './models/user.pipe';
import { LeaseAppSettingsComponent } from './administration-main/lease-app-settings/lease-app-settings.component';
import {CommonComponentsModule} from "../components/common/common.module";
import {AccordionModule} from "ngx-bootstrap/accordion";

@NgModule({
  declarations: [
    AdministrationMainComponent,
    AdministrationComponent,
    NewUserComponent,
    UserSearchViewComponent,
    UserSettingsComponent,
    UserGroupSettingsComponent,
    UserGroupPipe,
    UserPipe,
    LeaseAppSettingsComponent
  ],
    imports: [CommonModule,
      RouterModule,
      AdministrationRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      CommonComponentsModule,AccordionModule],
  providers: [DatePipe]
})
export class AdministrationModule { }
