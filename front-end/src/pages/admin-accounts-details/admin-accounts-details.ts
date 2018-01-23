import { Component, ViewChild } from '@angular/core';
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

  id: number;
  birthDay: string;

  @ViewChild('name') name: string;
  @ViewChild('password') password: string;

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams) { }

  requestUpdateAccount () {
    console.log(123);
  }

  ionViewWillLeave() {
    this.storage.remove('account-details');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.id = response['account_id'];
      this.name['value'] = response['account_name'];
      this.birthDay = new Date(response['account_bday']).toISOString();
    });
  }

}
