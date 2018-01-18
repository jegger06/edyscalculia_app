import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminChapterPage } from './admin-chapter';

@NgModule({
  declarations: [
    AdminChapterPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminChapterPage),
  ],
})
export class AdminChapterPageModule {}
