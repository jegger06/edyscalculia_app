import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdminSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-settings',
  templateUrl: 'admin-settings.html',
})
export class AdminSettingsPage implements OnInit {

  user: Object = {};
  tileItem: Array<{
    title: string,
    link: string
  }>;

  constructor (
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams) { }

  routeTo (link: string): void {
    this.navCtrl.push(link);
  }

  ngOnInit (): void {
    this.tileItem = [
      { title: 'Accounts', link: 'AdminManageAccountsPage' },
      { title: 'Difficulty', link: 'AdminManageDifficultyPage' },
      { title: 'Difficulty Range', link: 'AdminManageDifficultyRangePage' }
    ];
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => !response && this.navCtrl.push('LogInPage'));
  }

}
