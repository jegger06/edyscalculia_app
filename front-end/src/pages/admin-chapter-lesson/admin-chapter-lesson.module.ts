import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminChapterLessonPage } from './admin-chapter-lesson';

@NgModule({
  declarations: [
    AdminChapterLessonPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminChapterLessonPage),
  ],
})
export class AdminChapterLessonPageModule {}
