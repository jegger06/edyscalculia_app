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

  ionViewDidLoad () {
    ['chapter-selected', 'lesson-selected'].map(store => this.storage.remove(store));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (response) {
        if (response['type_id'] === 1) {
          this.navCtrl.push('AdminDashboardPage');
          return;
        }
        this.isLoggedIn = response['authenticated'] || true;
        this.routeDirection = 'ProfilePage';
        this.buttonText = 'Profile';
        return;
      }
      this.storage.clear();
    });
  }

}
