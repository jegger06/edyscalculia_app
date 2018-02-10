import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the ProfileUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-profile-update',
  templateUrl: 'profile-update.html',
})
export class ProfileUpdatePage {

  user: Object = {};

  @ViewChild('password') password: Object = {};

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

  requestFreshInfo (): void {
    this.http.get(`${ api.host }/user/${ this.user['account_id'] }`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.storage.clear().then(() => {
          const userDetails = {
            ...this.user,
            ...response['details']
          }
          this.storage.set('account', userDetails).then(() => this.navCtrl.push('ProfilePage'));
        });
      }
    });
  }

  requestUpdateAccount (): void {
    const updateData: Object = {
      type_id: this.user['type_id'],
      account_name: this.user['account_name'],
      account_bday: this.user['account_bday']
    };
    this.password['value'] && !((/^\s*$/).test(this.password['value'])) && (updateData['account_password'] = this.password['value']);
    this.http.put(`${ api.host }/user/${ this.user['account_id'] }`, updateData, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      this.storage.get('account').then(account => {
        if (account && Number(this.user['type_id']) === 2 && Number(account['account_id']) === Number(this.user['account_id'])) {
          this.storage.clear().then(() => this.navCtrl.push('LogInPage'));
          return;
        }
        this.requestFreshInfo();
      });
    }, error => this.toastMessage(error['message'], error['success']));
  }

  requestDeleteAccount (id: number): void {
    const alert = this.alertCtrl.create({
      title: 'Delete Account',
      cssClass: 'alert-delete-header',
      message: 'Deleting account will delete also all the data in chapter, test, and activities. Are you sure to continue?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            this.http.delete(`${ api.host }/user/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.toastMessage(response['message'], response['success']);
              this.navCtrl.pop();
            }, error => this.toastMessage(error['message'], error['success']));
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => !response ? this.navCtrl.push('LogInPage') : this.user = response);
  }

}
