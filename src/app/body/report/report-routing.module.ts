import {RouterModule, Routes} from "@angular/router";
import {NewUserComponent} from "../administration/new-user/new-user.component";
import {UserSearchViewComponent} from "../administration/user-search-view/user-search-view.component";
import {ReportComponent} from "./report.component";
import {NgModule} from "@angular/core";
import {ReportMainComponent} from "./report-main/report-main.component";

const routes: Routes = [
  {
    path: 'report',
    component: ReportComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: ReportMainComponent },
      { path: 'user/new', component: NewUserComponent },
      { path: 'user-search', component: UserSearchViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
