import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { DiscoverPopUpPage } from '../discover-pop-up/discover-pop-up'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public storage: Storage) { }

  presentPopover (event: any): void {
    const popover = this.popoverCtrl.create(DiscoverPopUpPage);
    popover.present({
      ev: event
    });
  }

  logOut (): void {
    this.navCtrl.push('LogOutPage');
  }

  routeTo (route: string): void {
    this.navCtrl.push(route);
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => !response ? this.navCtrl.push('LogInPage') : this.user = response);
  }

}
