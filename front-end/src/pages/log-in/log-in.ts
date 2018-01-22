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
import { api } from '../../config'

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  @ViewChild('username') username: Object = {};
  @ViewChild('password') password: Object = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public storage: Storage) { }
  
  toastMessage (message) {
    this.toastCtrl.create({
      message,
      cssClass: 'toast-error-message',
      duration: 3000
    }).present();
  }

  goToPage (id, slog) {
    if (id === 1 && slog === 'admin') {
      this.navCtrl.push('AdminDashboardPage');
      return;
    }
    this.navCtrl.push('UserHomePage');
    return;
  }

  requestAuth () {
    const user = this.username['value'];
    const pass = this.password['value'];
    if (!user || !pass) {
      this.toastMessage('Both fields are required! Check and try again.');
      return;
    }
    this.http.post(`${api.host}/user/login`, {
      "account_username": user,
      "account_password": pass
    }).subscribe(account => {
      if (account.hasOwnProperty('user')) {
        account['user']['token'] = account['token'];
        this.storage.set('account', account['user']).then(response => {
          this.goToPage(response['type_id'], response['type_slog']);
        });
      }
      this.toastMessage(account['message']);
      return;
    }, error => this.toastMessage(`${ error['name'] }: ${ error['message'] }`));
  }

  toRegister () {
    this.navCtrl.push('RegisterPage');
  }

  ionViewWillEnter () {
    this.storage.get('account').then(response => response && (this.goToPage(response['type_id'], response['type_slog'])));
  }

}
