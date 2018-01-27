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
  chapterStatus: number;
  isUpdate: boolean = false;
  updateChapterContent: Object = {};
  @ViewChild('chapter') chapter: Object = {};
  @ViewChild('chapterTitle') title: Object = {};

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: HttpClient,
    public alterCtrl: AlertController,
    public toastCtrl: ToastController) { }

  chapterDetails (chapter: Object): void {
    const alert = this.alterCtrl.create({
      title: 'Chapter Details',
      cssClass: 'alert-edit-header',
      message: chapter['chapter_text'],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'View Lessons',
          handler: () => {
            alert.dismiss();
            this.storage.set('chapter', chapter).then(() => this.navCtrl.push('AdminChapterLessonPage'));
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  chapterSort (): void {
    this.fetchAllRecords(this.chapter['value']);
  }

  addChapterTitle (): void {
    const title = this.title['value'];
    if ((/^\s*$/).test(title)) {
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

  editChapter (event: any, chapter: Object): void {
    event.stopPropagation();
    this.isUpdate = true;
    this.updateChapterContent = chapter;
    this.chapterStatus = chapter['chapter_status'];
    this.title['value'] = chapter['chapter_text'];
  }

  updateChapter (): void {
    if ((/^\s*$/).test(this.title['value'])) {
      this.toastMessage('Chapter title update should not be empty.');
      return;
    }
    const id = this.updateChapterContent['chapter_id'];
    const dataToSave = {
      chapter_slog: this.title['value'].toLowerCase().split(' ').join('-'),
      chapter_text: this.title['value'],
      chapter_status: this.chapterStatus
    };
    this.http.put(`${ api.host }/chapter/${ id }`, dataToSave, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(chapterUpdated => {
      if (chapterUpdated['success']) {
        this.isUpdate = false;
        this.title['value'] = '';
        this.chapterLists = this.chapterLists.map(list => list['chapter_id'] === id ? { ...list, ...dataToSave } : list);
        this.toastMessage(chapterUpdated['message'], chapterUpdated['success']);
      } else {
        this.toastMessage(chapterUpdated['message']);
      }
    }, error => this.toastMessage(error['message']));
  }

  cancelUpdate (): void {
    this.isUpdate = false;
    this.title['value'] = '';
  }

  deleteChapter (event: any, id: number): void {
    event.stopPropagation();
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
              } else {
                this.toastMessage(response['message']);
              }
            }, error => this.toastMessage(error['message']));
            return false;
          }
        }
      ]
    });
    deleteAlert.present();
  }

  viewAll () {
    this.sort = 'all';
    this.fetchAllRecords();
  }

  fetchAllRecords (sort: string | number = 'all'): void {
    this.http.get(`${ api.host }/chapter/lists?sort=${ sort }`).subscribe(response => this.chapterLists = response['chapters'], error => this.toastMessage(error['message']));
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchAllRecords();
    });
  }

}
