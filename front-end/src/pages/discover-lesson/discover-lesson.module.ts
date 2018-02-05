import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscoverLessonPage } from './discover-lesson';

@NgModule({
  declarations: [
    DiscoverLessonPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscoverLessonPage),
  ],
})
export class DiscoverLessonPageModule {}
