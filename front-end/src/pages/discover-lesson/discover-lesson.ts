import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the DiscoverLessonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-discover-lesson',
  templateUrl: 'discover-lesson.html',
})
export class DiscoverLessonPage {

  user: Object = {};
  chapter: any;
  chapterLessonLists: Array<{
    lesson_id: number,
    account_id: number,
    chapter_id: number,
    lesson_title: string,
    lesson_slog: string,
    lesson_content: string,
    lesson_status: number,
    lesson_date: string,
    chapter_text: string,
    chapter_status: number,
    account_name: string,
    account_username: string
  }>;

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public sanitizer: DomSanitizer,
    public navParams: NavParams) { }

  logOut (): void {
    this.navCtrl.push('LogOutPage');
  }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  lessonDetails (lesson: Object): void {
    this.storage.set('lesson-selected', lesson).then(() => this.navCtrl.push('DiscoverLessonDetailsPage'));
  }

  requestPreTest (lesson: Object): void {
    this.storage.set('lesson-selected', lesson).then(response => {
      if (Object.keys(this.user).length > 0) {
        this.http.get(`${ api.host }/score/pre-test/${ lesson['lesson_id'] }`, {
          headers: new HttpHeaders().set('Authorization', this.user['token'])
        }).subscribe(response => {
          if (response['success'] && response['detail']) {
            this.alertCtrl.create({
              title: 'Pre-Test Information',
              cssClass: 'alert-edit-header',
              message: `You have already got a ${ response['detail']['score_count'] }% score in this lesson.`,
              buttons: [
                { text: 'Done' }
              ]
            }).present();
            return;
          }
          this.navCtrl.push('DiscoverLessonExamPrePage');
        }, error => this.toastMessage(error['message'], error['success']));
        return;
      }
      this.navCtrl.push('DiscoverLessonExamPrePage');
    });
  }

  fetchLesson (): void {
    const chapterId = this.chapter['chapter_id'];
    this.http.get(`${ api.host }/lesson/lists/${ chapterId }?sort=all`).subscribe(response => {
      if (response['success']) {
        this.chapterLessonLists = response['lessons'].map(lesson => {
          lesson['lesson_content'] = this.sanitizer.bypassSecurityTrustHtml(lesson['lesson_content']);
          return lesson;
        });
      }
    });
  }

  ionViewWillEnter () {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
      }
      this.storage.get('chapter-selected').then(response => {
        if (response) {
          this.chapter = response;
          this.fetchLesson();
          return;
        }
        this.navCtrl.push('DiscoverPage');
      });
    });
  }

}
