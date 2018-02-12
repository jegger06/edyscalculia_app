import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IonicPage, NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import * as $ from 'jquery';

/**
 * Generated class for the DiscoverLessonExamPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index'
import { DiscoverPopUpPage } from '../discover-pop-up/discover-pop-up';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-discover-lesson-exam-post',
  templateUrl: 'discover-lesson-exam-post.html',
})
export class DiscoverLessonExamPostPage {

  user: Object = {};
  lesson: Object = {};
  hasUser: boolean;
  examScore: Object = {};
  isLoading: boolean = true;
  disabled: boolean = false;
  buttonText: string = 'Submit Answers';
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

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public sanitize: DomSanitizer,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public navParams: NavParams) { }

  presentPopover(event: any) {
    const popover = this.popoverCtrl.create(DiscoverPopUpPage);
    popover.present({
      ev: event
    });
  }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
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
      answer
    };
  }

  submitSummaryScore (): void {
    if (Object.keys(this.examScore).length === this.questionsCount) {
      this.disabled = true;
      this.buttonText = 'Processing score...';
      const preExamDetails = Object.assign({
        examDetails: this.examScore,
        difficulty_level: 2
      }, this.lesson);
      this.storage.set('lesson-exam', preExamDetails).then(response => {
        this.disabled = false;
        this.buttonText = 'Submit Answers';
        this.navCtrl.push('DiscoverLessonExamSummaryPage');
      });
      return;
    }
    this.toastMessage('Answer all the questions and try again.');
  }

  fetchPostTestQuestions (): void {
    const lesson = this.lesson['lesson_id'];
    this.http.get(`${ api.host }/question/exam?lesson_id=${ lesson }&difficulty=2&status=1`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
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
        this.isLoading = false;
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
        this.hasUser = true;
      }
    });
    this.storage.get('lesson-selected').then(response => {
      if (response) {
        this.lesson = response;
        this.fetchPostTestQuestions();
      }
    });
    this.storage.get('lesson-exam').then(response => {
      if (response && this.lesson['lesson_id'] === response['lesson_id'] && (response['difficulty_level'] === 2)) {
        this.navCtrl.push('DiscoverLessonExamSummaryPage');
      }
    });
  }

}
