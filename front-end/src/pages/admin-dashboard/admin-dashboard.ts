import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-dashboard',
  templateUrl: 'admin-dashboard.html',
})
export class AdminDashboardPage {

  dashboardList: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: HttpClient,
    public alertCtrl: AlertController) { }

  showDetails (details: string[], type: string): void {
    let detailsMessage: string[];
    let routePage: string;
    switch (type) {
      case 'account':
        routePage = 'AdminAccountsPage';
        detailsMessage = details.map(item => `<li>${ item['account_name'] }</li>`);
        break;
      default:
        routePage = 'AdminChapterPage';
        detailsMessage = details.map(item => `<li>${ item['chapter_text'] }</li>`);
        break;
    }
    const alert = this.alertCtrl.create({
      title: 'List of all Chapter',
      cssClass: 'alert-edit-header',
      message: `<ul>${ detailsMessage }<ul>`,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Settings',
          handler: () => {
            alert.dismiss();
            this.navCtrl.push(routePage);
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidEnter (): void {
    Promise.all([
      this.http.get(`${ api.host }/chapter/lists`).subscribe(response => {
        this.dashboardList['chapters'] = response['chapters'];
        this.dashboardList['chaptersCount'] = response['chapters']['length'];
      })
    ]);
  }

  ionViewWillEnter(): void {
    this.storage.get('account').then(response => {
      if (response) {
        this.http.get(`${ api.host }/user/lists?type=1&date=1`, {
          headers: new HttpHeaders().set('Authorization', response['token'])
        }).subscribe(response => {
          this.dashboardList['accounts'] = response['accounts'];
          this.dashboardList['accountsList'] = response['accounts']['length'];
        });
        return;
      }
      this.navCtrl.push('LogInPage');
    });
  }

}
