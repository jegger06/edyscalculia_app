import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the DiscoverLessonExamSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';
import { DiscoverPopUpPage } from '../discover-pop-up/discover-pop-up';

@IonicPage()
@Component({
  selector: 'page-discover-lesson-exam-summary',
  templateUrl: 'discover-lesson-exam-summary.html',
})
export class DiscoverLessonExamSummaryPage {

  user: Object = {};
  hasExam: boolean;
  examResult: Object = {};
  points: number = 0;
  items: number = 0;
  title: string = '';
  lesson: number;
  difficulty: number = 0;
  percentScore: number = 0;

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
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

  saveScore (): void {
    if (Object.keys(this.user).length > 0) {
      this.http.post(`${ api.host }/score/create`, {
        lesson_id: this.lesson,
        difficulty_id: this.difficulty,
        score: this.percentScore
      }, {
        headers: new HttpHeaders().set('Authorization', this.user['token'])
      }).subscribe(response => {
        this.toastMessage(response['message'], response['success']);
        this.navCtrl.push('DiscoverLessonPage');
      }, error => this.toastMessage(error['message'], error['success']));
      return;
    }
    this.navCtrl.push('LogInPage');
  }

  gotLessonPage (): void {
    this.navCtrl.push('DiscoverLessonPage');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => response && (this.user = response));
    this.storage.get('lesson-selected').then(lesson => this.lesson = lesson['lesson_id']);
    this.storage.get('lesson-exam').then(response => {
      if (!response) {
        this.hasExam = false;
        this.navCtrl.push('DiscoverLessonPage');
        return;
      }
      this.hasExam = true;
      response = response['examDetails'];
      this.items = Object.keys(response).length;
      for (let property in response) {
        const toLower = (str) => str.toString().toLowerCase();
        if (response.hasOwnProperty(property) && (toLower(response[property]['correct']) === toLower(response[property]['answer']))) {
          this.points = this.points + 1;
        }
        if (response[property]['type'] === 'pre-test') {
          this.title = 'Pre-Test';
          this.difficulty = 1;
        }
      }
      this.percentScore = (this.points / this.items) * 100;
      this.examResult['score-count'] = this.points;
      const halfOfTotalItems = Math.round(Number(this.items) / 2);
      if (this.points !== halfOfTotalItems) {
        if (this.points > halfOfTotalItems) {
          this.examResult['img-src-remark'] = 'assets/imgs/test-thumbs-up.svg';
        } else {
          this.examResult['img-src-remark'] = 'assets/imgs/test-sad.svg';
        }
      } else {
        this.examResult['img-src-remark'] = 'assets/imgs/test-happy.svg';
      }
    });
  }

}
