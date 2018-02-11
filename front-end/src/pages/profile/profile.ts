import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index'
import { DiscoverPopUpPage } from '../discover-pop-up/discover-pop-up'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: Object = {};
  scoreSheet: Array<{
    score_id: number,
    lesson_id: number,
    difficulty_id: number,
    account_id: number,
    score_count: number,
    score_date: string | number,
    lesson_title: string,
    chapter_id: number,
    chapter_text: string
  }>;
  scoreSheetCount: number = 0;
  difficulty: number = 1;
  difficulties: Array<{
    difficulty_id: number,
    account_id: number,
    difficulty_slog: string,
    difficulty_text: string,
    difficulty_date: string,
    account_name: string,
    account_username: string
  }>;
  difficultyCount: number = 0;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public storage: Storage) { }

  presentPopover (event: any): void {
    const popover = this.popoverCtrl.create(DiscoverPopUpPage);
    popover.present({
      ev: event
    });
  }

  toastMessage (message: string): void {
    this.toastCtrl.create({
      message,
      cssClass: 'toast-error-message',
      duration: 3000
    }).present();
  }

  logOut (): void {
    this.navCtrl.push('LogOutPage');
  }

  routeTo (route: string): void {
    this.navCtrl.push(route);
  }

  fetchDifficulties (): void {
    this.http.get(`${ api.host }/difficulty/lists`).subscribe(response => {
      if (response['success'] && response['difficulties']) {
        this.difficulties = response['difficulties'];
        this.difficulty = response['difficulties'][0]['difficulty_id'];
        this.difficultyCount = response['difficulties']['length'];
      }
    })
  }

  fetchTopScoreHistory (): void {
    this.http.get(`${ api.host }/score/lists/${ this.difficulty }`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success'] && response['scoreSheet']) {
        this.scoreSheet = response['scoreSheet'];
        this.scoreSheetCount = response['scoreSheet']['length'];
      }
    }, error => this.toastMessage(error['message']));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
        this.fetchDifficulties();
        this.fetchTopScoreHistory();
        return;
      }
      this.navCtrl.push('LogInPage');
    });
  }

}
