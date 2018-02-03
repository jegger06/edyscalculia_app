import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AdminChapterLessonQuestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-chapter-lesson-questions',
  templateUrl: 'admin-chapter-lesson-questions.html',
})
export class AdminChapterLessonQuestionsPage {

  user: Object = {};
  lesson: Object = {};
  sort: string | number = 2;
  questionsList: Array<{
    question_id: number,
    question_range_id: number,
    question_type_id: number,
    account_id: number,
    difficulty_id: number,
    question_content: string,
    question_status: number,
    question_date: string,
    account_name: string,
    answer_id: number,
    answer_choices: string,
    answer_key: string
  }>;
  questionsListCount: number = 0;
  questionTitle: string = 'Adding';

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams) { }

  updateQuestion (question: Object): void {
    console.log(question)
  }

  deleteQuestion (id: number): void {
    console.log(id)
  }

  fetchLessonQuestions (sort: string | number): void {
    this.http.get(`${ api.host }/question/lists/${ this.lesson['lesson_id'] }`).subscribe(response => {
      if (response['success']) {
        this.questionsList = response['questions'];
        this.questionsListCount = response['questions']['length'];
      }
    })
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
      this.storage.get('chapter-lesson').then(lesson => (this.lesson = lesson) && this.fetchLessonQuestions(this.sort));
    });
  }

}
