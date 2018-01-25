import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

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

  sort: number = 2;
  user: Object = {};
  lessons: Object = {};
  lessonsCount: number = 0;
  public options: Object = {
    imageUploadURL: 'http://localhost:8000/api/upload/image_upload',
    videoUploadURL: 'http://localhost:8000/api/upload/video_upload',
    placeholderText: 'Hello, Admin!',
    pastePlain: true,
    charCounterCount: false,
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', 'spellChecker', 'help', 'html', 'undo', 'redo'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', 'spellChecker', 'help', 'html', 'undo', 'redo'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'color', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', 'spellChecker', 'help', 'html', 'undo', 'redo']
  };

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public navParams: NavParams) { }

  createLesson (): void {
    this.lessons = {
      success: true,
      data: 'asdasd'
    };
  }

  fetchLesson (sort: number): void {
    this.storage.get('chapter').then(chapter => {
      const route = chapter ? chapter['chapter_id'] : '';
      this.http.get(`${ api.host }/lesson/lists/${ route }?sort=${ sort }`).subscribe(lessons => {
        this.lessons = lessons;
        this.lessonsCount = lessons['lessons'] ? lessons['lessons']['length'] : 0;
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
