import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminManageDifficultyPage } from './admin-manage-difficulty';

@NgModule({
  declarations: [
    AdminManageDifficultyPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminManageDifficultyPage),
  ],
})
export class AdminManageDifficultyPageModule {}
