import { Storage } from '@ionic/storage';
import { api } from './../../config/index';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the AdminManageAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-manage-accounts',
  templateUrl: 'admin-manage-accounts.html',
})
export class AdminManageAccountsPage {

  user: Object = {};
  sort: string | number = 'all';
  accountTypeList: any;
  accountTypeListCount: number = 0;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public http: HttpClient) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  deleteAccountType (id: number): void {
    const alert = this.alertCtrl.create({
      title: 'Delete Account Type',
      cssClass: 'alert-delete-header',
      message: 'This account type will be deleted permanently. Are you sure to continue?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            this.http.delete(`${ api.host }/account/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.toastMessage(response['message'], response['success']);
              this.fetchAccountType(this.sort);
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  accountTypeSort () {
    this.fetchAccountType(this.sort);
  }

  fetchAccountType (sort: string | number): void {
    let sortMessage = `?sort=${ sort }`;
    if (sort === 'all') {
      sortMessage = '';
    }
    this.http.get(`${ api.host }/account/lists${sortMessage}`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.accountTypeList = response['account_types'];
        this.accountTypeListCount = response['account_types']['length'];
        return;
      }
      !response['success'] && (this.accountTypeList = response['message']);
    })
  }

  ionViewWillEnter () {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchAccountType(this.sort);
    })
  }

}
