import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminAccountsPage } from './admin-accounts';

@NgModule({
  declarations: [
    AdminAccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminAccountsPage),
  ],
})
export class AdminAccountsPageModule {}
