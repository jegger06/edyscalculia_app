import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LogOutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  template: '',
})
export class LogOutPage {

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) { }

  ionViewDidEnter (): void {
    this.storage.remove('account').then(() => this.navCtrl.push('HomePage'));
  }

}
