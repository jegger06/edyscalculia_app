import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminAccountsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-accounts-details',
  templateUrl: 'admin-accounts-details.html',
})
export class AdminAccountsDetailsPage {

  user: Object = {};

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams) { }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => !response ? this.navCtrl.push('LogInPage') : this.user = response);
  }

}
