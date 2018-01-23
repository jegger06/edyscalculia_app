import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminAccountsDetailsPage } from './admin-accounts-details';

@NgModule({
  declarations: [
    AdminAccountsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminAccountsDetailsPage),
  ],
})
export class AdminAccountsDetailsPageModule {}
