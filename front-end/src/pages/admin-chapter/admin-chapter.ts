import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
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
    account_id?: number,
    account_name?: string,
    account_username?: string,
    chapter_date: string,
    chapter_id: number,
    chapter_slog: string,
    chapter_status: string | number,
    chapter_text: string
  }> = [];
  sort: string = 'all';
  user: Object = {};
  @ViewChild('chapter') chapter: Object = {};
  @ViewChild('chapterTitle') title: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: HttpClient,
    public alterCtrl: AlertController,
    public toastCtrl: ToastController) { }

  toastMessage (message, type = false) {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  chapterSort () {
    this.fetchAllRecords(this.chapter['value']);
  }

  fetchAllRecords (sort = 'all') {
    this.http.get(`${ api.host }/chapter/lists?sort=${ sort }`).subscribe(response => this.chapterLists = response['chapters'], error => this.toastMessage(error['message']));
  }

  addChapterTitle () {
    const title = this.title['value'];
    if (!title || title.trim() === '') {
      this.toastMessage('Chapter Title should not be empty.');
      return;
    }
    this.http.post(`${ api.host }/chapter/create`, {
      chapter_slog: title.toLowerCase().split(' ').join('-'),
      chapter_text: title
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.http.get(`${ api.host }/chapter/${ response['chapter_id'] }`).subscribe(chapter => {
          this.chapterLists ? this.chapterLists.unshift(chapter['details']) : this.chapterLists = Array(1).fill(chapter['details']);
          this.toastMessage('New chapter title has been added.', true);
          this.title['value'] = '';
        }, error => this.toastMessage(error['message']));
        return;
      }
      this.toastMessage(response['message']);
      return;
    }, error => this.toastMessage(error['message']));
  }

  editChapter (id) {
    this.http.get(`${ api.host }/chapter/${ id }`).subscribe(chapter => {
      const edit = this.alterCtrl.create({
        title: 'Edit Chapter',
        cssClass: 'alert-edit-header',
        inputs: [
          {
            type: 'text',
            id: 'edit-chapter',
            value: chapter['details']['chapter_text']
          }
        ],
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Update',
            handler: data => {
              edit.dismiss();
              const dataToSave = {
                chapter_slog: data[0].toLowerCase().split(' ').join('-'),
                chapter_text: data[0],
                chapter_status: chapter['details']['chapter_status']
              };
              if (!data[0] || data[0].trim() === '') {
                this.toastMessage('Chapter title update should not be empty.');
                return false;
              }
              this.http.put(`${ api.host }/chapter/${ id }`, dataToSave, {
                headers: new HttpHeaders().set('Authorization', this.user['token'])
              }).subscribe(chapterUpdated => {
                if (chapterUpdated['success']) {
                  this.chapterLists = this.chapterLists.map(list => list['chapter_id'] === id ? { ...list, ...dataToSave } : list);
                  this.toastMessage(chapterUpdated['message'], chapterUpdated['success']);
                }
              }, error => this.toastMessage(error['message']));
              return false;
            }
          }
        ]
      });
      edit.present();
    }, error => this.toastMessage(error['message']));
  }

  deleteChapter (id) {
    const deleteAlert = this.alterCtrl.create({
      title: 'Delete Chapter',
      cssClass: 'alert-delete-header',
      message: 'Are you sure you want to delete this chapter?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            deleteAlert.dismiss();
            this.http.delete(`${ api.host }/chapter/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              if (response['success']) {
                this.chapterLists = this.chapterLists.filter(chapter => chapter.chapter_id !== id);
                this.toastMessage(response['message'], response['success']);
              }
            }, error => this.toastMessage(error['message']));
            return false;
          }
        }
      ]
    });
    deleteAlert.present();
  }

  ionViewDidEnter () {
    this.fetchAllRecords();
  }

  ionViewWillEnter () {
    this.storage.get('account').then(response => !response ? this.navCtrl.push('LogInPage') : this.user = response);
  }

}
