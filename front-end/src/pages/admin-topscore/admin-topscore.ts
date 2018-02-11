import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AdminTopscorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-topscore',
  templateUrl: 'admin-topscore.html',
})
export class AdminTopscorePage {

  user: Object = {};
  isLoading: boolean = true;
  topScore: Array<{
    score_id: number,
    lesson_id: number,
    difficulty_id: number,
    account_id: number,
    score_count: number,
    score_date: string,
    difficulty_text: string,
    account_name: string,
    lesson_title: string
  }>;
  difficulties: Array<{
    difficulty_id: number,
    account_id: number,
    difficulty_slog: string,
    difficulty_text: string,
    difficulty_date: string,
    account_name: string,
    account_username: string
  }>;
  difficultiesCount: number = 0;
  topScoreCount: number = 0;
  difficultyId: number = 1;

  constructor (
    public navCtrl: NavController,
    public http: HttpClient,
    public navParams: NavParams,
    public storage: Storage) { }

  fetchDifficulties (): void {
    this.http.get(`${ api.host }/difficulty/lists`).subscribe(response => {
      if (response['success']) {
        this.difficulties = response['difficulties'];
        this.difficultiesCount = response['difficulties']['length'];
      }
    });
  }

  fetchTopScore (): void {
    this.http.get(`${ api.host }/score/top?difficulty=${ this.difficultyId }`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.isLoading = false;
      if (response['success'] && response['topscore']) {
        this.topScore = response['topscore'];
        this.topScoreCount = response['topscore']['length'];
      }
    });
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
        this.fetchDifficulties();
        this.fetchTopScore();
        return;
      }
      this.navCtrl.push('LogInPage');
    });
  }

}
