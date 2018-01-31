import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the AdminManageDifficultyRangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-manage-difficulty-range',
  templateUrl: 'admin-manage-difficulty-range.html',
})
export class AdminManageDifficultyRangePage {

  user: Object = {};
  sort: number = 0;
  rangeFrom: string = '0';
  rangeTo: string = '100';
  isUpdate: boolean = false;
  difficultyTitle: string = 'Adding';
  difficultyRangeList: Array<{
    question_range_id: number,
    account_id: number,
    question_range_slog: string,
    question_range_from: string,
    question_range_to: string,
    question_range_date: string,
    account_name: string,
    account_username: string
  }>;
  difficultyRangeListCount: number = 0;
  range: number[];

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

  difficultyRangeSort (): void {
    this.fetchDifficultyRange(this.sort);
  }

  addDifficultyRange (): void {
    
  }

  updateDifficultyRange (difficulty: Object): void {

  }

  deleteDifficultyRange (id: number): void {
    const alert = this.alertCtrl.create({
      title: 'Delete Difficulty Range',
      cssClass: 'alert-delete-header',
      message: 'This difficulty range type will be deleted permanently. Are you sure to continue?',
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
              this.fetchDifficultyRange(this.sort);
            });
            return false;
          }
        }
      ]
    })
    alert.present();
  }

  fetchDifficultyRange (sort: number): void {
    this.http.get(`${ api.host }/question-range/lists?sort=${ sort }`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.difficultyRangeList = response['question_ranges'];
        this.difficultyRangeListCount = response['question_ranges']['length'];
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchDifficultyRange(this.sort);
    })
  }

}
