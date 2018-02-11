import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AdminManageQuestionRangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-manage-question-range',
  templateUrl: 'admin-manage-question-range.html',
})
export class AdminManageQuestionRangePage {

  user: Object = {};
  rangeFrom: number = 0;
  rangeTo: number = 100;
  isUpdate: boolean = false;
  isLoading: boolean = true;
  questionRangeTitle = 'Adding';
  questionRangeId: number;
  questionRangeList: Array<{
    question_range_id: number,
    account_id: number,
    question_range_slog: string,
    question_range_from: string,
    question_range_to: string,
    question_range_date: string,
    account_name: string,
    account_username: string
  }>;
  questionRangeListCount: number = 0;
  rangeOption: number[] = Array.apply(null, { length: 101 }).map(Number.call, Number);

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  addQuestionRange (): void {
    const slog = `${ this.rangeFrom }-${ this.rangeTo }`
    this.http.post(`${ api.host }/question-range/create`, {
      question_range_slog: slog,
      question_range_from: this.rangeFrom,
      question_range_to: this.rangeTo
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.cancelUpdate();
        this.fetchQuestionRange();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  updateProceed (): void {
    const slog = `${ this.rangeFrom }-${ this.rangeTo }`
    this.http.put(`${ api.host }/question-range/${ this.questionRangeId }`, {
      question_range_slog: slog,
      question_range_from: this.rangeFrom,
      question_range_to: this.rangeTo
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.cancelUpdate();
        this.fetchQuestionRange();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  updateQuestionRange (question: Object): void {
    this.isUpdate = true;
    this.questionRangeTitle = 'Updating';
    this.questionRangeId = question['question_range_id'];
    this.rangeFrom = question['question_range_from'];
    this.rangeTo = question['question_range_to'];
  }

  cancelUpdate(): void {
    this.isUpdate = false;
    this.rangeFrom = 0;
    this.rangeTo = 100;
    this.questionRangeTitle = 'Adding';
  }

  deleteQuestionRange (id: number): void {
    const alert = this.alertCtrl.create({
      title: 'Delete Question Range',
      cssClass: 'alert-delete-header',
      message: 'This difficulty range will be deleted permanently. Are you sure to continue?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            this.http.delete(`${ api.host }/question-range/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.toastMessage(response['message'], response['success']);
              this.fetchQuestionRange();
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  fetchQuestionRange (): void {
    this.http.get(`${ api.host }/question-range/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.isLoading = false;
      if (response['success']) {
        this.questionRangeList = response['question_ranges'];
        this.questionRangeListCount = response['question_ranges']['length'];
      }
    }, error => {
      this.isLoading = false;
      this.toastMessage(error['message'], error['success']);
    });
  }
  
  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchQuestionRange();
    })
  }

}
