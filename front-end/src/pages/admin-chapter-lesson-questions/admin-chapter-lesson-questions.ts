import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AdminChapterLessonQuestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { api } from './../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-chapter-lesson-questions',
  templateUrl: 'admin-chapter-lesson-questions.html',
})
export class AdminChapterLessonQuestionsPage {

  user: Object = {};
  lesson: Object = {};
  sort: string | number = 2;
  questionTitle: string = 'Adding';
  questionsList: Array<{
    question_id: number,
    question_range_id: number,
    question_type_id: number,
    account_id: number,
    difficulty_id: number,
    question_content: string,
    question_status: number,
    question_date: string,
    account_name: string,
    answer_id: number,
    answer_choices: string,
    answer_key: string
  }>;
  questionsCount: number = 0;
  questionRangeList: Array<{
    question_range_id: number,
    account_id: number,
    question_range_slog: string,
    question_range_from: string,
    question_range_to: string,
    question_range_date: string,
    account_name: string,
    account_username: string
  }>;
  questionRangeCount: number = 0;
  questionTypeList: Array<{
    question_type_id: number,
    account_id: number,
    question_type_slog: string,
    question_type_text: string,
    question_type_date: string,
    account_name: string,
    account_username: string
  }>;
  questionTypeCount: number = 0;
  questionDiffcultiesList: Array<{
    difficulty_id: number,
    account_id: number,
    difficulty_slog: string,
    difficulty_text: string,
    difficulty_date: string,
    account_name: string,
    account_username: string
  }>;
  questionDiffcultiesCount: number = 0;
  isUpdate: boolean = false;
  contentUpdate: any;
  contentUpdateDifficulty: number;
  contentUpdateType: number;
  contentUpdateRange: number;
  contentUpdateChoices: string = '';
  contentUpdateAnswer: string = '';
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

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams) { }

  toastMessage (message: string, type: boolean = false): void {
    this.toastCtrl.create({
      message,
      cssClass: type ? 'toast-success-message' : 'toast-error-message',
      duration: 3000
    }).present();
  }

  showChoicesAndAnswer (id: number): void {
    
  }

  addQuestion (): void {
    const editorContent = this.editorContent
    const contentUpdateChoices = this.contentUpdateChoices
    const contentUpdateAnswer = this.contentUpdateAnswer
    if ((/^\s*$/).test(editorContent)) {
      this.toastMessage('Question should not be empty.');
      return;
    }
    if ((/^\s*$/).test(contentUpdateChoices)) {
      this.toastMessage('Make an atleast 2 choices and try again.');
      return;
    }
    if ((/^\s*$/).test(contentUpdateAnswer)) {
      this.toastMessage('Choose 1 answer and try again.');
      return;
    }
    const question = {
      lesson_id: this.lesson['lesson_id'],
      question_range_id: this.contentUpdateRange,
      question_type_id: this.contentUpdateType,
      difficulty_id: this.contentUpdateDifficulty,
      question_content: editorContent,
      answer_choices: contentUpdateChoices,
      answer_key: contentUpdateAnswer
    }
    console.log(question)
  }

  updateQuestion (event: any, question: Object): void {
    console.log(question)
  }

  deleteQuestion (event: any, id: number): void {
    event.stopPropagation();
    const alert = this.alertCtrl.create({
      title: 'Delete Lesson',
      cssClass: 'alert-delete-header',
      message: 'Are you sure you want to delete this question? All records will be lost.',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Proceed',
          cssClass: 'delete-button',
          handler: () => {
            alert.dismiss();
            this.http.delete(`${ api.host }/question/${ id }`, {
              headers: new HttpHeaders().set('Authorization', this.user['token'])
            }).subscribe(response => {
              this.toastMessage(response['message'], response['success']);
              this.fetchLessonQuestions(this.sort);
            }, error => this.toastMessage(error['message'], error['success']));
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  fetchLessonQuestions (sort: string | number): void {
    this.http.get(`${ api.host }/question/lists/${ this.lesson['lesson_id'] }`).subscribe(response => {
      if (response['success']) {
        this.questionsList = response['questions'];
        this.questionsCount = response['questions']['length'];
      }
    })
  }

  fetchQuestionDifficulty (): void {
    this.http.get(`${ api.host }/difficulty/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.contentUpdateDifficulty = response['difficulties'][0]['difficulty_id'];
        this.questionDiffcultiesList = response['difficulties'];
        this.questionDiffcultiesCount = response['difficulties']['length'];
        return;
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  fetchQuestionType (): void {
    this.http.get(`${ api.host }/question-type/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.contentUpdateType = response['question_types'][0]['question_type_id'];
        this.questionTypeList = response['question_types'];
        this.questionTypeCount = response['question_types']['length'];
      }
      return response;
    }, error => this.toastMessage(error['message'], error['success']));
  }

  fetchQuestionRange (): void {
    this.http.get(`${ api.host }/question-range/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success']) {
        this.contentUpdateRange = response['question_ranges'][0]['question_range_id'];
        this.questionRangeList = response['question_ranges'];
        this.questionRangeCount = response['question_ranges']['length'];
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  ionViewDidLeave (): void {
    this.storage.remove('chapter-lesson');
  }

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (!response) {
        this.navCtrl.push('LogInPage');
        return;
      }
      this.user = response;
      this.storage.get('chapter-lesson').then(lesson => {
        if (!lesson) {
          this.navCtrl.push('LogInPage');
          return;
        }
        this.lesson = lesson;
        this.fetchQuestionRange();
        this.fetchQuestionType();
        this.fetchQuestionDifficulty();
        this.fetchLessonQuestions(this.sort);
        this.showChoicesAndAnswer(this.contentUpdateType);
      });
    });
  }

}
