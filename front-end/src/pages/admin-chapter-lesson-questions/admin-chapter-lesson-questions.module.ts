import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminChapterLessonQuestionsPage } from './admin-chapter-lesson-questions';

import 'froala-editor/js/froala_editor.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [
    AdminChapterLessonQuestionsPage,
  ],
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    IonicPageModule.forChild(AdminChapterLessonQuestionsPage),
  ],
})
export class AdminChapterLessonQuestionsPageModule {}
