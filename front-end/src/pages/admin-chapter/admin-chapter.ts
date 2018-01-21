import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  @ViewChild('chapterTitle') title: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: HttpClient) { }

  ionViewWillEnter() {
    this.storage.get('account').then(response => !response && this.navCtrl.push('LogInPage'));
  }

  addChapterTitle () {
    console.log(api)
    // this.http.post()
  }

}
