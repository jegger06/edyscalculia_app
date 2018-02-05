import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    public navParams: NavParams) { }

  lessonDetails (lesson: Object): void {
    this.storage.set('lesson-selected', lesson).then(() => this.navCtrl.push('DiscoverLessonDetailsPage'));
  }

  fetchLesson (): void {
    const chapterId = this.chapter['chapter_id'];
    this.http.get(`${ api.host }/lesson/lists/${ chapterId }?sort=all`).subscribe(data => this.chapterLessonLists = data['lessons']);
  }

  ionViewWillEnter () {
    this.storage.get('chapter-selected').then(response => {
      if (response) {
        this.chapter = response;
        this.fetchLesson();
        return;
      }
      this.navCtrl.push('DiscoverPage');
    });
  }

}
