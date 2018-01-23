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
  user: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: HttpClient,
    public alertCtrl: AlertController) { }

  showDetails (details: string[], type: string): void {
    let detailsMessage: string[];
    let routePage: string;
    let title: string;
    switch (type) {
      case 'account':
        routePage = 'AdminAccountsPage';
        title = 'List of all Account';
        detailsMessage = details.map(item => `<li>${ item['account_name'] }</li>`);
        break;
        default:
        routePage = 'AdminChapterPage';
        title = 'List of all Chapter';
        detailsMessage = details.map(item => `<li>${ item['chapter_text'] }</li>`);
        break;
    }
    const alert = this.alertCtrl.create({
      title,
      cssClass: 'alert-edit-header',
      message: `<ul>${ detailsMessage.join('') }<ul>`,
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

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      Promise.all([
        this.http.get(`${ api.host }/chapter/lists`).subscribe(response => {
          this.dashboardList['chapters'] = response['chapters'];
          this.dashboardList['chaptersCount'] = response['chapters']['length'];
        }),
        this.http.get(`${ api.host }/user/lists?type=1&date=1`, {
          headers: new HttpHeaders().set('Authorization', this.user['token'])
        }).subscribe(response => {
          this.dashboardList['accounts'] = response['accounts'];
          this.dashboardList['accountsList'] = response['accounts']['length'];
        })
      ]);
    });
  }

}
