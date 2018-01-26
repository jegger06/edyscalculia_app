import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

/**
 * Generated class for the AdminChapterLessonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-chapter-lesson',
  templateUrl: 'admin-chapter-lesson.html',
})
export class AdminChapterLessonPage {

  // TODO: 
  // "chapter_id": number,
  // "lesson_title": string,
  // "lesson_slog": string,
  // "lesson_content": string | text

  sort: number = 2;
  user: Object = {};
  lessons: Object = {};
  chapter: Object = {};
  lessonsCount: number = 0;
  public editorContent: string;
  public options: Object = {
    imageUploadURL: `${ api.host }/upload/image_upload`,
    videoUploadURL: `${ api.host }/upload/video_upload`,
    placeholderText: 'Create some awesome lesson today!',
    pastePlain: true,
    charCounterCount: false,
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', 'spellChecker', 'help', 'html', 'undo', 'redo'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', 'spellChecker', 'help', 'html', 'undo', 'redo'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', 'spellChecker', 'help', 'html', 'undo', 'redo']
  };

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public navParams: NavParams) { }

  submitLesson (): void {
    console.log(this.chapter, this.editorContent)
  }

  fetchLesson (sort: number): void {
    this.storage.get('chapter').then(chapter => {
      this.chapter = chapter;
      const route = chapter ? chapter['chapter_id'] : '';
      this.http.get(`${ api.host }/lesson/lists/${ route }?sort=${ sort }`).subscribe(lessons => {
        this.lessons = lessons;
        lessons['lessons'] && (this.lessonsCount = lessons['lessons']['length']);
      });
    });
  }

  sortNow (sort: number): void {
    this.fetchLesson(sort);
  }

  ionViewDidLeave (): void {
    this.storage.remove('chapter');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.fetchLesson(this.sort);
    });
  }

}
