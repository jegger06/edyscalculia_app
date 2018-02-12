import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the DiscoverLessonDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';
import { DiscoverPopUpPage } from '../discover-pop-up/discover-pop-up';

@IonicPage()
@Component({
  selector: 'page-discover-lesson-details',
  templateUrl: 'discover-lesson-details.html',
})
export class DiscoverLessonDetailsPage {

  user: Object = {};
  lesson: Object = {};
  hasUser: boolean;
  isLoading: boolean = true;
  disabled: boolean = false;
  activitiesText: string = 'Activity';
  preTestText: string = 'Post-Test';
  lessonsList: Array<{
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
  lessonsCount: number = 0;
  lessonDetails: Object = {};

  constructor (
    public navCtrl: NavController,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
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

  goToExam (route: string): void {
    this.navCtrl.push(route);
  }

  goToPage (route: string): void {
    this.isLoading = true;
    const currentLesson = this.lessonDetails;
    const allLesson = this.lessonsList;
    const index = allLesson.findIndex(lesson => (lesson['lesson_id'] === currentLesson['lesson_id']));
    if (route === 'prev') {
      if (index === 0) {
        this.toastMessage('No more previous lesson...');
        return;
      }
      this.storage.remove('lesson-selected').then(() => {
        this.storage.set('lesson-selected', allLesson[index - 1]).then(response => {
          this.lessonDetails = response;
          this.isLoading = false;
          window.scrollTo(0, 0);
        });
      });
    } else {
      if ((allLesson['length'] - 1) === index) {
        this.toastMessage('No more next lesson...');
        return;
      }
      this.storage.remove('lesson-selected').then(() => {
        this.storage.set('lesson-selected', allLesson[index + 1]).then(response => {
          this.lessonDetails = response;
          this.isLoading = false;
          window.scrollTo(0, 0);
        });
      });
    }
  }

  fetchAlllesson (): void {
    this.http.get(`${ api.host }/lesson/lists/${ this.lesson['chapter_id'] }`).subscribe(response => {
      this.isLoading = false;
      if (response['success']) {
        this.lessonsList = response['lessons'].map(lesson => {
          lesson['lesson_content'] = this.sanitizer.bypassSecurityTrustHtml(lesson['lesson_content']);
          return lesson;
        });
        this.lessonsCount = response['lessons']['length'];
      }
    }, error => {
      this.isLoading = false;
      this.toastMessage(error['message'], error['success']);
    });
  }

  fetchLessonDetails (): void {
    this.http.get(`${ api.host }/lesson/${ this.lesson['lesson_id'] }`).subscribe(response => {
      if (response['success']) {
        const details = response['details'];
        details['lesson_content'] = this.sanitizer.bypassSecurityTrustHtml(details['lesson_content']);
        this.lessonDetails = details;
        this.isLoading = false;
      }
    });
  }
  
  ionViewWillEnter () {
    this.storage.get('account').then(response => response && (this.user = response) && (this.hasUser = true));
    this.storage.get('lesson-selected').then(response => {
      if (response) {
        this.lesson = response;
        this.fetchLessonDetails();
        this.fetchAlllesson();
        return;
      }
      this.navCtrl.push('DiscoverLessonPage');
    });
  }

}
