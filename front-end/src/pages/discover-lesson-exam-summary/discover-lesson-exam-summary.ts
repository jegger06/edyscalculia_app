import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DiscoverLessonExamSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discover-lesson-exam-summary',
  templateUrl: 'discover-lesson-exam-summary.html',
})
export class DiscoverLessonExamSummaryPage {

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverLessonExamSummaryPage');
  }

}
