import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminChapterLessonPage } from './admin-chapter-lesson';

import 'froala-editor/js/froala_editor.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [
    AdminChapterLessonPage,
  ],
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    IonicPageModule.forChild(AdminChapterLessonPage),
  ],
})
export class AdminChapterLessonPageModule {}
