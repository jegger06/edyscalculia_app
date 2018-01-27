import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdminChapterLessonQuestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-chapter-lesson-questions',
  templateUrl: 'admin-chapter-lesson-questions.html',
})
export class AdminChapterLessonQuestionsPage {

  user: Object = {};
  lesson: Object = {};
  sort: string | number = 2;
  questions: Object = {};

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams) { }

  fetchQuestions (sort: string | number) {
    this.questions['questionsCount'] = 0;
  }

  ionViewDidLeave (): void {
    this.storage.remove('chapter-lesson');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.storage.get('chapter-lesson').then(lesson => (this.lesson = lesson) && this.fetchQuestions(this.sort));
    });
  }

}
