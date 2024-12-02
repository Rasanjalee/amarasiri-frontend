import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdministrationComponent} from "./administration.component";
import {AdministrationMainComponent} from "./administration-main/administration-main.component";
import {NewUserComponent} from "./new-user/new-user.component";
import {UserSearchViewComponent} from "./user-search-view/user-search-view.component";
const routes: Routes = [
  {
    path: 'administration',
    component: AdministrationComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: AdministrationMainComponent },
      { path: 'user/new', component: NewUserComponent },
      { path: 'user-search', component: UserSearchViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
