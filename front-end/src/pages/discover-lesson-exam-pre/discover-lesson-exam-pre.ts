import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the DiscoverLessonExamPrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-discover-lesson-exam-pre',
  templateUrl: 'discover-lesson-exam-pre.html',
})
export class DiscoverLessonExamPrePage {

  user: Object = {};
  lesson: Object = {};
  questions: Array<{
    question_id: number,
    lesson_id: number,
    question_range_id: number,
    question_type_id: number,
    difficulty_id: number,
    question_content: string,
    question_status: number,
    answer_id: number,
    answer_choices: string[] | number,
    answer_key: string | number
  }>;
  questionsCount: number = 0;
  examScore: Object = {};

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public sanitize: DomSanitizer,
    public navParams: NavParams) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  fetchPreTest (): void {
    const url = `${ api.host }/question/exam?lesson_id=${ this.lesson['lesson_id'] }&difficulty=1`;
    const request = this.user ? this.http.get(url) : this.http.get(url, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    });
    request.subscribe(response => {
      if (response['success'] && response['questions']) {
        this.questions = response['questions'].map(question => {
          question['answer_choices'] = eval(question['answer_choices']);
          question['question_content'] = this.sanitize.bypassSecurityTrustHtml(question['question_content']);
          return question;
        });
        this.questionsCount = response['questions']['length'];
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  addScore (correct: any, answer: any, i: number): void {
    this.examScore[`question-${ (i + 1) }`] = {
      correct,
      answer
    };
  }

  submitSummaryScore (): void {
    this.storage.set('lesson-pre-exam', {
      account: this.user,
      answers: this.examScore
    }).then(response => this.navCtrl.push('DiscoverLessonExamSummaryPage'));
  }

  ionViewWillEnter () {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
      }
      this.storage.get('lesson-selected').then(response => {
        if (response) {
          this.lesson = response;
          this.fetchPreTest();
        }
      });
    });
  }

}