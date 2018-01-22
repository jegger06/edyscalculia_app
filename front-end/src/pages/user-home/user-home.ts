import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UserHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-home',
  templateUrl: 'user-home.html',
})
export class UserHomePage {

  account: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) { }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => this.account = response);
  }

}
