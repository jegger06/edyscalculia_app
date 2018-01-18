import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdminHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {

  account: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) { }

  ionViewWillEnter () {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
      }
      this.account = response;
    });
  }

}
