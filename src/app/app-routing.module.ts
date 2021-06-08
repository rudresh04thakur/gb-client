import { NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { GrouptableComponent } from './grouptable/grouptable.component';
import { HomeComponent } from './home/home.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'add',component:AddComponent},
  {path:'edit/:id',component:EditComponent},
  {path:'view/:id',component:ViewComponent},
  {path:'grouprow', component:GrouptableComponent},
  {path:'', component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
