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
import { api } from '../../config'

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  birthDay = new Date().toISOString();
  @ViewChild('name') name;
  @ViewChild('username') username;
  @ViewChild('password') password;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public toastCtrl: ToastController) { }

  ionViewWillEnter() {
    this.storage.get('account').then(response => {
      if (response) {
        this.goToPage(response['type_id'], response['type_slog']);
      }
    });
  }

  goToPage (id, slog) {
    if (id === 1 && slog === 'admin') {
      this.navCtrl.push('AdminHomePage');
      return;
    }
    this.navCtrl.push('UserHomePage');
    return;
  }

  toastMessage (message, type = false) {
    this.toastCtrl.create({
      message,
      cssClass: (type ? 'toast-success-message' : 'toast-error-message'),
      duration: 3000
    }).present();
  }

  requestNewAccount () {
    const account_name = this.name.value
    const account_bday = this.birthDay
    const account_username = this.username.value
    const account_password = this.password.value
    if (!account_name || !account_bday || !account_username || !account_password) {
      this.toastMessage('Don\'t leave a blank in your information.');
      return;
    }
    this.http.post(`${ api.host }/user/register`, {
      account_name,
      account_bday,
      account_username,
      account_password
    }).subscribe(account => {
      this.toastMessage(account['message'], account['success']);
      if (account['success']) {
        this.name.value = '';
        this.birthDay = new Date().toISOString();
        this.username.value = '';
        this.password.value = '';
      }
    });
  }

  toLogin () {
    this.navCtrl.push('LogInPage');
  }

}
