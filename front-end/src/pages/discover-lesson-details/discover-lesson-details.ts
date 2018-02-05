import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the DiscoverLessonDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-discover-lesson-details',
  templateUrl: 'discover-lesson-details.html',
})
export class DiscoverLessonDetailsPage {

  lesson: Object = {};
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
    public toastCtrl: ToastController,
    public navParams: NavParams) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  goToPage (route: string): void {
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
        });
      });
    }
    if (route === 'next') {
      if ((allLesson['length'] - 1) === index) {
        this.toastMessage('No more next lesson...');
        return;
      }
      this.storage.remove('lesson-selected').then(() => {
        this.storage.set('lesson-selected', allLesson[index + 1]).then(response => {
          this.lessonDetails = response;
        });
      });
    }
  }

  requestAnExam (lesson: Object): void {
    console.log(lesson);
  }

  fetchAlllesson (): void {
    this.http.get(`${ api.host }/lesson/lists/${ this.lesson['chapter_id'] }`).subscribe(response => {
      if (response['success']) {
        this.lessonsList = response['lessons'].map(lesson => {
          lesson['lesson_content'] = this.sanitizer.bypassSecurityTrustHtml(lesson['lesson_content']);
          return lesson;
        });
        this.lessonsCount = response['lessons']['length'];
      }
    })
  }

  fetchLessonDetails (): void {
    this.http.get(`${ api.host }/lesson/${ this.lesson['lesson_id'] }`).subscribe(response => {
      if (response['success']) {
        const details = response['details'];
        details['lesson_content'] = this.sanitizer.bypassSecurityTrustHtml(details['lesson_content']);
        this.lessonDetails = details;
      }
    });
  }
  
  ionViewWillEnter () {
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
