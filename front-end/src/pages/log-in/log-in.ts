import { HttpClient } from '@angular/common/http'
import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index'

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  disabled: boolean = false;
  buttonText: string = 'Submit';

  @ViewChild('username') username: Object = {};
  @ViewChild('password') password: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public storage: Storage) { }
  
  toastMessage (message: string): void {
    this.toastCtrl.create({
      message,
      cssClass: 'toast-error-message',
      duration: 3000
    }).present();
  }

  goToPage (id: number, slog: string): boolean {
    if (id === 1 && slog === 'admin') {
      this.navCtrl.push('AdminDashboardPage');
      return;
    }
    this.navCtrl.push('DiscoverPage');
    return;
  }

  requestAuth (): void {
    const user = this.username['value'];
    const pass = this.password['value'];
    if ((/^\s*$/).test(user) || (/^\s*$/).test(pass)) {
      this.toastMessage('Both fields are required! Check and try again.');
      return;
    }
    this.buttonText = 'Checking...';
    this.disabled = true;
    this.http.post(`${api.host}/user/login`, {
      "account_username": user,
      "account_password": pass
    }).subscribe(account => {
      this.disabled = false;
      this.buttonText = 'Submit';
      if (account.hasOwnProperty('user')) {
        account['user']['token'] = account['token'];
        this.storage.set('account', account['user']).then(response => {
          this.goToPage(response['type_id'], response['type_slog']);
        });
      }
      this.toastMessage(account['message']);
      return;
    }, error => {
      this.disabled = false;
      this.buttonText = 'Submit';
      this.toastMessage(`${error['name']}: ${error['message']}`);
    });
  }

  toRegister (): void {
    this.navCtrl.push('RegisterPage');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => response && (this.goToPage(response['type_id'], response['type_slog'])));
  }

}
