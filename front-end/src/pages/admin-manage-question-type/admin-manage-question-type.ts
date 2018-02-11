import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AdminManageQuestionTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-manage-question-type',
  templateUrl: 'admin-manage-question-type.html',
})
export class AdminManageQuestionTypePage {

  user: Object = {};
  questionTypeId: number;
  isUpdate: boolean = false;
  isLoading: boolean = true;
  questionTitle: string = 'Adding';
  questionTypeList: Array<{
    account_id: number,
    question_type_slog: string,
    question_type_text: string,
    question_type_date: string,
    account_name: string,
    account_username: string
  }>;
  questionTypeListCount: number = 0;

  @ViewChild('questionTypeDesc') questionType: Object;

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  addQuestionType (): void {
    const type = this.questionType['value'];
    if ((/^\s*$/).test(type)) {
      this.toastMessage('Difficulty type should not be empty');
      return;
    }
    this.http.post(`${ api.host }/question-type/create`, {
      question_type_slog: type.toLowerCase().split(' ').join('-'),
      question_type_text: type
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.questionType['value'] = '';
        this.fetchQuestionType();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  updateQuestionType(question: Object): void {
    this.isUpdate = true;
    this.questionTitle = 'Updating';
    this.questionTypeId = question['question_type_id'];
    this.questionType['value'] = question['question_type_text'];
  }

  cancelUpdate (): void {
    this.isUpdate = false;
    this.questionTitle = 'Adding';
    this.questionType['value'] = '';
  }

  updateProceed (): void {
    const type = this.questionType['value'];
    this.http.put(`${ api.host }/question-type/${ this.questionTypeId }`, {
      question_type_slog: type.toLowerCase().split(' ').join('-'),
      question_type_text: type
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.cancelUpdate();
        this.fetchQuestionType();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  deleteQuestionType (id: number): void {
    const alert = this.alertCtrl.create({
      title: 'Delete Question Type',
      cssClass: 'alert-delete-header',
      message: 'This question type will be deleted permanently. Are you sure to continue?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            this.http.delete(`${ api.host }/question-type/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.toastMessage(response['message'], response['success']);
              if (response['success']) {
                this.fetchQuestionType();
              }
            }, error => this.toastMessage(error['message'], error['success']));
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  fetchQuestionType (): void {
    this.http.get(`${ api.host }/question-type/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.isLoading = false;
      if (response['success']) {
        this.questionTypeList = response['question_types'];
        this.questionTypeListCount = response['question_types']['length'];
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
      this.fetchQuestionType();
    })
  }

}
