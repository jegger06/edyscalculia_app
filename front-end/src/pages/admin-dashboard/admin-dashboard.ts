import { HttpClient } from '@angular/common/http';
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

  showDetails (details: string[]): void {
    const detailsMessage = details.map(item => `<li>${ item['chapter_text'] }</li>`);
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
            this.navCtrl.push('AdminChapterPage');
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
    this.storage.get('account').then(response => !response && this.navCtrl.push('LogInPage'));
  }

}
