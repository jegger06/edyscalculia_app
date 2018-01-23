import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdminAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-accounts',
  templateUrl: 'admin-accounts.html',
})
export class AdminAccountsPage {

  accounts: Array<{
    account_id: number,
    account_name: string,
    account_bday: string,
    account_username: string,
    account_date: string,
    type_id: number,
    type_description: string
  }>;
  user: Object = {};
  dateClassname: string = 'md-arrow-dropup';
  sortByType: number = 1;
  sortByDate: number = 1;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public storage: Storage) { }

  viewDetails (account: Object): void {
    console.log(account);
  }

  toggleSortByType () {
    this.sortByType = this.sortByType === 1 ? 2 : 1;
    this.fetchAccounts(this.sortByType, this.sortByDate);
  }

  toggleSortByDate () {
    this.sortByDate = this.sortByDate === 1 ? 2 : 1;
    this.dateClassname = this.sortByDate === 1 ? 'md-arrow-dropup' : 'md-arrow-dropdown';
    this.fetchAccounts(this.sortByType, this.sortByDate);
  }

  fetchAccounts (type: number, date: number): void {
    this.http.get(`${ api.host }/user/lists?type=${ type }&date=${ date }`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => this.accounts = response['accounts']);
  }
  
  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchAccounts(this.sortByType, this.sortByDate);
    });
  }

}
