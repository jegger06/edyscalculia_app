import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  isLoading: boolean = true;
  lessons: Array<{
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
  chapter: Object = {};
  lessonId: number;
  lessonTitle: string;
  lessonsCount: number = 0;
  lessonStatus: number = 1;
  isUpdate: boolean = false;
  public editorContent: string = '';
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
  lessonTypeTitle: string = 'Adding';

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public sanitize: DomSanitizer,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  addQuestion (lesson: Object): void {
    const alert = this.alertCtrl.create({
      title: 'Lesson Option',
      cssClass: 'alert-edit-header',
      message: 'Are you going to add a question?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          handler: () => {
            alert.dismiss();
            this.storage.set('chapter-lesson', lesson).then(() => this.navCtrl.push('AdminChapterLessonQuestionsPage')).catch(() => {
              this.toastMessage('Error encountered when putting a lesson in to your storage.');
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  addLesson (): void {
    if ((/^\s*$/).test(this.lessonTitle)) {
      this.toastMessage('Lesson title should not be empty.');
      return;
    }
    if ((/^\s*$/).test(this.editorContent)) {
      this.toastMessage('Lesson content should not be empty.');
      return;
    }
    this.http.post(`${api.host }/lesson/create`, {
      chapter_id: this.chapter['chapter_id'],
      lesson_title: this.lessonTitle,
      lesson_slog: this.lessonTitle.toLowerCase().split(' ').join('-'),
      lesson_content: this.editorContent
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.fetchLesson(this.sort);
        this.editorContent = this.lessonTitle = '';
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  cancelUpdateLesson (): boolean {
    this.lessonTitle = this.editorContent = '';
    return this.isUpdate = false;
  }

  updateLesson (event: any, lesson: Object): void {
    event.stopPropagation();
    this.editorContent = lesson['lesson_content']['changingThisBreaksApplicationSecurity'];
    this.lessonStatus = lesson['lesson_status'];
    this.lessonId = lesson['lesson_id'];
    this.lessonTitle = lesson['lesson_title'];
    this.isUpdate = true;
  }

  updateLessonProceed (): void {
    this.http.put(`${ api.host }/lesson/${ this.lessonId }`, {
      lesson_title: this.lessonTitle,
      lesson_slog: this.lessonTitle.toLowerCase().split(' ').join('-'),
      lesson_content: this.editorContent,
      lesson_status: this.lessonStatus
    }, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.fetchLesson(this.sort);
        this.isUpdate = false;
        this.lessonTitle = this.editorContent = '';
      }
      this.toastMessage(response['message'], response['success']);
    }, error => this.toastMessage(error['message'], error['success']));
  }

  deleteLesson (event: any, id: number): void {
    event.stopPropagation();
    const alert = this.alertCtrl.create({
      title: 'Delete Lesson',
      cssClass: 'alert-delete-header',
      message: 'Are you sure you want to delete this lesson? All records will be lost.',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            if (this.isUpdate) {
              this.isUpdate = false;
              this.lessonTitle = this.editorContent = '';
            }
            this.http.delete(`${ api.host }/lesson/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.fetchLesson(this.sort);
              this.toastMessage(response['message'], response['success']);
            }, error => this.toastMessage(error['message'], error['success']));
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  fetchLesson (sort: number): void {
    this.storage.get('chapter').then(chapter => {
      this.chapter = chapter;
      const route = chapter ? chapter['chapter_id'] : '';
      this.http.get(`${ api.host }/lesson/lists/${ route }?sort=${ sort }`).subscribe(response => {
        this.isLoading = false;
        if (response['success'] && response['lessons']) {
          this.lessons = response['lessons'].map(lesson => {
            lesson['lesson_content'] = this.sanitize.bypassSecurityTrustHtml(lesson['lesson_content']);
            return lesson;
          });
          this.lessonsCount = response['lessons']['length'];
          return;
        }
        this.lessonsCount = 0;
      });
    });
  }

  sortNow (sort: number): void {
    this.fetchLesson(sort);
  }

  viewAll () {
    this.sort = 2;
    this.fetchLesson(this.sort);
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
