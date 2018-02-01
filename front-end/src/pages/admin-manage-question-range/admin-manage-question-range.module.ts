import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminManageQuestionRangePage } from './admin-manage-question-range';

@NgModule({
  declarations: [
    AdminManageQuestionRangePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminManageQuestionRangePage),
  ],
})
export class AdminManageQuestionRangePageModule {}
