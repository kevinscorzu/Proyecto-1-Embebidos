import { hostViewClassName } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseViewComponent } from './Components/house-view/house-view.component';
import { LogInComponent } from './Components/log-in/log-in.component';

const routes: Routes = [
  { path: 'houseView', component: HouseViewComponent },
  { path: '', component: LogInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [HouseViewComponent,LogInComponent]