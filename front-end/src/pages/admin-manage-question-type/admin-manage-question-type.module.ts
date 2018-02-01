import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminManageQuestionTypePage } from './admin-manage-question-type';

@NgModule({
  declarations: [
    AdminManageQuestionTypePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminManageQuestionTypePage),
  ],
})
export class AdminManageQuestionTypePageModule {}
