import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  isLoggedIn: boolean = false;
  buttonText: string = 'Login';
  routeDirection: string = 'LogInPage';

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) { }

  routeTo (param: string): void {
    this.navCtrl.push(param);
  }
  
  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (response) {
        this.isLoggedIn = response['authenticated'];
        this.routeDirection = 'ProfilePage';
        this.buttonText = 'Profile';
      }
    });
  }

}
