import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminChapterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-chapter',
  templateUrl: 'admin-chapter.html',
})
export class AdminChapterPage {

  chapterLists: Array<{
    account_id: number,
    account_name: string,
    account_username: string,
    chapter_date: string,
    chapter_id: number,
    chapter_slog: string,
    chapter_status: string,
    chapter_text: string
  }>;
  sort: string = 'all';
  user: Object = {};
  @ViewChild('chapter') chapter: Object = {};
  @ViewChild('chapterTitle') title: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: HttpClient, public toastCtrl: ToastController) { }

  toastMessage (message) {
    this.toastCtrl.create({
      message,
      cssClass: 'toast-error-message',
      duration: 3000
    }).present();
  }

  chapterSort () {
    this.fetchAllRecords(this.chapter.value);
  }

  fetchAllRecords (sort = 'all') {
    this.http.get(`${ api.host }/chapter/lists?sort=${ sort }`).subscribe(response => this.chapterLists = response['chapters']);
  }

  ionViewDidEnter () {
    this.fetchAllRecords();
  }

  ionViewWillEnter() {
    this.storage.get('account').then(response => !response ? this.navCtrl.push('LogInPage') : this.user = response);
  }

  addChapterTitle () {
    const title = this.title.value;
    if (!title || title.trim() === '') {
      this.toastMessage('Chapter Title should not be empty.');
      return;
    }
    console.log(this.user)
    this.http.post(`${ api.host }/chapter/create`, {
      chapter_slog: title.toLowerCase().split(' ').join('-'),
      chapter_text: title
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
    }, error => {
      this.toastMessage(error['message']);
    })
  }

}
