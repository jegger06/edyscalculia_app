import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminChapterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-chapter',
  templateUrl: 'admin-chapter.html',
})
export class AdminChapterPage {

  @ViewChild('chapterTitle') title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) { }

  ionViewWillEnter() {
    this.storage.get('account').then(response => !response && this.navCtrl.push('LogInPage'));
  }

}
