import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminAccountsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-accounts-details',
  templateUrl: 'admin-accounts-details.html',
})
export class AdminAccountsDetailsPage {

  id: number;
  type: number;
  token: string;
  birthDay: string;

  @ViewChild('name') name: Object;
  @ViewChild('password') password: Object;

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

  requestUpdateAccount (): void {
    const updateData: Object = {
      type_id: this.type,
      account_name: this.name['value'],
      account_bday: this.birthDay
    };
    this.password['value'] && !((/^\s*$/).test(this.password['value'])) && (updateData['account_password'] = this.password['value']);
    this.http.put(`${ api.host }/user/${ this.id }`, updateData, {
      headers: new HttpHeaders().set('Authorization', this.token)
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      this.storage.get('account').then(account => {
        if (account && Number(this.type) === 2 && Number(account['account_id']) === Number(this.id)) {
          this.storage.clear().then(() => this.navCtrl.push('LogInPage'));
        }
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
              headers: new HttpHeaders().set('Authorization', this.token)
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

  ionViewWillLeave (): void {
    this.storage.remove('account-details');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.token = response['token'];
      return this.storage.get('account-details');
    }).then(response => {
      this.id = response['account_id'];
      this.type = response['type_id'];
      this.name['value'] = response['account_name'];
      this.birthDay = new Date(response['account_bday']).toISOString();
    });
  }

}
