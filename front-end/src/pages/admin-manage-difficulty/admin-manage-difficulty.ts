import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AdminManageDifficultyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-manage-difficulty',
  templateUrl: 'admin-manage-difficulty.html',
})
export class AdminManageDifficultyPage {

  user: Object = {};
  difficultyId: number;
  isUpdate: boolean = false;
  sort: string | number = 'all';
  difficultyTitle: string = 'Adding';
  difficultyTypeList: Array<{
    difficulty_id: number,
    account_id: number,
    difficulty_slog: string,
    difficulty_text: string,
    difficulty_date: string,
    account_name: string,
    account_username: string
  }>;
  difficultyTypeListCount: number = 0;

  @ViewChild('difficultyTypeDesc') diffType: string;

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

  addDiffcultyType (): void {
    const diffType = this.diffType['value'];
    if ((/^\s*$/).test(diffType)) {
      this.toastMessage('Difficulty type should not be empty');
      return;
    }
    this.http.post(`${ api.host }/difficulty/create`, {
      difficulty_slog: diffType.toLowerCase().split(' ').join('-'),
      difficulty_text: diffType
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      this.fetchDifficulty();
    }, error => this.toastMessage(error['message'], error['success']));
  }

  updateProceed (): void {
    const diffType = this.diffType['value'];
    if ((/^\s*$/).test(diffType)) {
      this.toastMessage('Difficulty type should not be empty');
      return;
    }
    this.http.put(`${ api.host }/difficulty/${ this.difficultyId }`, {
      difficulty_slog: diffType.toLowerCase().split(' ').join('-'),
      difficulty_text: diffType
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.cancelUpdate();
        this.fetchDifficulty();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  cancelUpdate (): void {
    this.isUpdate = false;
    this.difficultyTitle = 'Adding';
    this.diffType['value'] = '';
  }

  updateDifficultyType (difficulty: Object): void {
    this.isUpdate = true;
    this.difficultyId = difficulty['difficulty_id'];
    this.difficultyTitle = 'Updating';
    this.diffType['value'] = difficulty['difficulty_text'];
  }

  deleteDifficultyType (id: number): void {
    const alert = this.alertCtrl.create({
      title: 'Delete Difficulty Type',
      cssClass: 'alert-delete-header',
      message: 'This difficulty type will be deleted permanently. Are you sure to continue?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            this.http.delete(`${ api.host }/difficulty/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.toastMessage(response['message'], response['success']);
              this.fetchDifficulty();
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  fetchDifficulty (): void {
    this.http.get(`${ api.host }/difficulty/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.difficultyTypeList = response['difficulties'];
        this.difficultyTypeListCount = response['difficulties']['length'];
        return;
      }
      this.toastMessage(response['message'], response['success']);
    }, error => this.toastMessage(error['message'], error['success']));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchDifficulty();
    });
  }

}
