import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminManageAccountsPage } from './admin-manage-accounts';

@NgModule({
  declarations: [
    AdminManageAccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminManageAccountsPage),
  ],
})
export class AdminManageAccountsPageModule {}
