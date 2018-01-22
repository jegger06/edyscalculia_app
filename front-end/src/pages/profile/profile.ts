import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  account: Object = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) { }

  ionViewWillEnter () {
    this.storage.get('account').then(response => response ? this.account = response : this.navCtrl.push('LogInPage'));
  }

}
