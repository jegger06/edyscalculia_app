import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the AdminManageAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-manage-accounts',
  templateUrl: 'admin-manage-accounts.html',
})
export class AdminManageAccountsPage {

  user: Object = {};
  accountTypeList: any;
  accountId: number;
  accountStatus: string | number;
  isUpdate: boolean = false;
  sort: string | number = 'all';
  accountTitle: string = 'Adding';
  accountTypeListCount: number = 0;

  @ViewChild('accountTypeDesc') typeDesc: Object;

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

  accountTypeSort(): void {
    this.fetchAccountType(this.sort);
  }

  addAccountType (): void {
    const accountType = this.typeDesc['value'];
    if ((/^\s*$/).test(accountType)) {
      this.toastMessage('Account type description should not be empty.');
      return;
    }
    this.http.post(`${ api.host }/account/create`, {
      type_slog: accountType.toLowerCase().split(' ').join('-'),
      type_description: accountType
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      this.fetchAccountType(this.sort);
    }, error => this.toastMessage(error['message'], error['success']));
  }

  updateAccountType (account: Object): void {
    this.isUpdate = true;
    this.accountId = account['type_id'];
    this.accountTitle = 'Updating';
    this.accountStatus = account['type_status'];
    this.typeDesc['value'] = account['type_description'];
  }

  updateProceed (): void {
    const accountType = this.typeDesc['value'];
    if ((/^\s*$/).test(accountType)) {
      this.toastMessage('Account type description should not be empty.');
      return;
    }
    this.http.put(`${ api.host }/account/${ this.accountId }`, {
      type_slog: accountType.toLowerCase().split(' ').join('-'),
      type_description: accountType,
      type_status: this.accountStatus
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.fetchAccountType(this.sort);
        this.cancelUpdate();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  cancelUpdate (): void {
    this.isUpdate = false;
    this.accountTitle = 'Adding';
    this.typeDesc['value'] = '';
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

  viewAll (): void {
    this.sort = 'all';
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
      if (response['success'] && response['account_types']) {
        this.accountTypeList = response['account_types'];
        this.accountTypeListCount = response['account_types']['length'];
        return;
      }
      this.accountTypeListCount = 0;
    })
  }

  ionViewWillEnter (): void {
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
