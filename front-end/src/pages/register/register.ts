import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Storage} from '@ionic/storage';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index'

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  birthDay: string = new Date().toISOString();
  @ViewChild('name') name: string;
  @ViewChild('username') username: string;
  @ViewChild('password') password: string;

  constructor (
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public toastCtrl: ToastController) { }

  goToPage (id: number, slog: string): boolean {
    if (id === 1 && slog === 'admin') {
      this.navCtrl.push('AdminDashboardPage');
      return;
    }
    this.navCtrl.push('UserHomePage');
    return;
  }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: (type ? 'toast-success-message' : 'toast-error-message'),
      duration: 3000
    }).present();
  }

  requestNewAccount (): void {
    const account_name = this.name['value'];
    const account_bday = this.birthDay;
    const account_username = this.username['value'];
    const account_password = this.password['value'];
    const test = [ account_name, account_bday, account_username, account_password ];
    for (let i = 0; i < (test.length - 1); i++) {
      if ((/^\s*$/).test(test[i])) {
        this.toastMessage('Don\'t leave a blank in your information.');
        return;
      }
    }
    this.http.post(`${ api.host }/user/register`, {
      account_name,
      account_bday,
      account_username,
      account_password
    }).subscribe(account => {
      this.toastMessage(account['message'], account['success']);
      if (account['success']) {
        this.name['value'] = '';
        this.birthDay = new Date().toISOString();
        this.username['value'] = '';
        this.password['value'] = '';
      }
    });
  }

  toLogin (): void {
    this.navCtrl.push('LogInPage');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => response && (this.goToPage(response['type_id'], response['type_slog'])));
  }

}
