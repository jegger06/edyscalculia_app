import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminTopscorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-topscore',
  templateUrl: 'admin-topscore.html',
})
export class AdminTopscorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) { }

  ionViewWillEnter() {
    this.storage.get('account').then(response => !response && this.navCtrl.push('LogInPage'));
  }

}
