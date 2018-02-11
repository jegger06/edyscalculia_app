import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';

/**
 * Generated class for the DiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';
import { DiscoverPopUpPage } from '../discover-pop-up/discover-pop-up';

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html'
})
export class DiscoverPage {

  user: Object = {};
  hasUser: boolean;
  chapterLists: Array<{
    chapter_id: number,
    account_id: number,
    chapter_slog: string,
    chapter_text: string,
    chapter_status: number,
    chapter_date: string,
    account_name: string,
    account_username: string
  }>;

  constructor (
    public navCtrl: NavController,
    public http: HttpClient,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public navParams: NavParams) { }

  presentPopover (event: any): void {
    const popover = this.popoverCtrl.create(DiscoverPopUpPage);
    popover.present({
      ev: event
    });
  }

  goToLogin (): void {
    this.navCtrl.push('LogInPage');
  }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  goToChapter (chapter: Object): void {
    this.storage.set('chapter-selected', chapter).then(response => this.navCtrl.push('DiscoverLessonPage'));
  }

  fetchAllRecords (): void {
    this.http.get(`${ api.host }/chapter/lists?sort=all`).subscribe(response => this.chapterLists = response['chapters'], error => this.toastMessage(error['message']));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      this.hasUser = false;
      if (response) {
        this.user = response;
        this.hasUser = true;
      }
      this.fetchAllRecords();
    }, error => this.toastMessage(error['message'], error['success']));
  }

}
