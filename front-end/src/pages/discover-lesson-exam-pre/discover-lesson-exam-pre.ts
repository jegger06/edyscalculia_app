import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as $ from 'jquery';

/**
 * Generated class for the DiscoverLessonExamPrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-discover-lesson-exam-pre',
  templateUrl: 'discover-lesson-exam-pre.html',
})
export class DiscoverLessonExamPrePage {

  user: Object = {};
  hasUser: boolean;
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

  logOut (): void {
    this.navCtrl.push('LogOutPage');
  }

  goToLogin (): void {
    this.navCtrl.push('LogInPage');
  }

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
          if (typeof question['answer_key'].toLowerCase() === 'boolean') {
            question['answer_choices'] = ['True', 'False'];
          }
          question['question_content'] = this.sanitize.bypassSecurityTrustHtml(question['question_content']);
          return question;
        });
        this.questionsCount = response['questions']['length'];
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  addScore (event: Object, type: string, correct: any, i: number, answer: any): void {
    if (type === 'button') {
      const selector = $(event['target']).is($('button')) ? $(event['target']) : $(event['target']).parent('button');
      selector.addClass('button-clicked').siblings('button').removeClass('button-clicked');
    } else if (type === 'input') {
      answer = '';
      answer = event['value'];
    }
    this.examScore[`pre-question-${ (i + 1) }`] = {
      correct,
      answer,
      type: 'pre-test'
    };
  }

  submitSummaryScore (): void {
    if (Object.keys(this.examScore).length === this.questionsCount) {
      const preExamDetails = Object.assign({
        examDetails: this.examScore
      }, this.lesson);
      this.storage.set('lesson-exam', preExamDetails).then(response => this.navCtrl.push('DiscoverLessonExamSummaryPage'));
      return;
    }
    this.toastMessage('Answer all the questions and try again.');
  }

  ionViewWillEnter () {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
        this.hasUser = true;
      }
    });
    this.storage.get('lesson-selected').then(response => {
      if (response) {
        this.lesson = response;
        this.fetchPreTest();
      }
    });
    this.storage.get('lesson-exam').then(response => {
      if (response && this.lesson['lesson_id'] === response['lesson_id']) {
        this.navCtrl.push('DiscoverLessonExamSummaryPage');
      }
    });
  }

}