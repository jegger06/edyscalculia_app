import { HttpClient } from '@angular/common/http'
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../api'

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  subscription: any;
  @ViewChild('username') username;
  @ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public toastCtrl: ToastController) { }

  toastMessage (message) {
    let toast = this.toastCtrl.create({
      message,
      cssClass: 'toast-error-message',
      duration: 3000
    }).present();
  }

  requestAuth () {
    const user = this.username.value;
    const pass = this.password.value;
    if (!user || !pass) {
      this.toastMessage('Both fields are required! Check and try again.');
      return;
    }
    this.subscription = this.http.post(`${ api.host }/user/login`, {
      "account_username": user,
      "account_password": pass
    }).subscribe(account => {
      if (account.hasOwnProperty('user')) {
        if (account['user']['type_id'] === 1 && account['user']['type_slog'] === 'admin') {
          this.navCtrl.push('AdminHomePage');
          return;
        }
        this.navCtrl.push('UserHomePage');
        return;
      }
      this.toastMessage(account['message']);
      return;
    });
  }

  toRegister () {
    this.navCtrl.push('RegisterPage');
  }

}
