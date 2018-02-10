import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DiscoverPopUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discover-pop-up',
  templateUrl: 'discover-pop-up.html',
})
export class DiscoverPopUpPage {

  constructor (
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) { }

  goToRoute (route: string): void {
    this.viewCtrl.dismiss();
    this.navCtrl.push(route);
  }

}
