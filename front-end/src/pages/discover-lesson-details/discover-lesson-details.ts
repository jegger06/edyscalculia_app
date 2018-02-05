import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    public storage: Storage,
    public navParams: NavParams) { }

  goToPage (route: string): void {

  }

  fetchAlllesson (): void {
    this.http.get(`${ api.host }/lesson/lists/${ this.lesson['lesson_id'] }`).subscribe(response => {
      if (response['success']) {
        this.lessonsList = response['lessons'];
        this.lessonsCount = response['lessons']['length'];
      }
    })
  }

  fetchLessonDetails (): void {
    this.http.get(`${ api.host }/lesson/${ this.lesson['lesson_id'] }`).subscribe(response => {
      if (response['success']) {
        this.lessonDetails = response['details'];
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
