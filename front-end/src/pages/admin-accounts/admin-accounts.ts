import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-accounts',
  templateUrl: 'admin-accounts.html',
})
export class AdminAccountsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) { }

  ionViewWillEnter() {
    this.storage.get('account').then(response => !response && this.navCtrl.push('LogInPage'));
  }

}
