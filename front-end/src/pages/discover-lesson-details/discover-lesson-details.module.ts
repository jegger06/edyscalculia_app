import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscoverLessonDetailsPage } from './discover-lesson-details';

@NgModule({
  declarations: [
    DiscoverLessonDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscoverLessonDetailsPage),
  ],
})
export class DiscoverLessonDetailsPageModule {}
