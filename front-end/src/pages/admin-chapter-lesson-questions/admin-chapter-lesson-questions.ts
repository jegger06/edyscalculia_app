import { DomSanitizer } from '@angular/platform-browser';
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
import { api } from '../../config/index';

@IonicPage()
@Component({
  selector: 'page-admin-chapter-lesson-questions',
  templateUrl: 'admin-chapter-lesson-questions.html',
})
export class AdminChapterLessonQuestionsPage {

  user: Object = {};
  lesson: Object = {};
  questionTitle: string = 'Adding';
  sortDifficulty: number = 1;
  sortRange: number = 0;
  sortStatus: number | string = 1;
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
  cloneUpdateType: number;
  contentUpdateRange: number = 0;
  questionUpdateId: number;
  questionUpdateStatus: number = 1;
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
  contentAnswerType: string = 'drag-and-drop';
  dragAndDrop: string = '';
  identification: string = '';
  multipleChoice: string = '';
  trueOrFalse: string = '';
  idA: string = '';
  idB: string = '';
  idC: string = '';

  constructor (
    public navCtrl: NavController,
    public storage: Storage,
    public http: HttpClient,
    public sanitize: DomSanitizer,
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
    if (this.questionTypeList) {
      const type = this.questionTypeList.filter(type => type['question_type_id'] === id)[0];
      this.contentAnswerType = type['question_type_slog'];
    }
  }

  addQuestion (): void {
    const editorContent = this.editorContent;
    let contentUpdateChoices = '';
    let contentUpdateAnswer = '';
    if (this.contentAnswerType === 'drag-and-drop') {
      this.toastMessage('Question type not supported yet.');
      return;
    }
    if (this.contentAnswerType === 'identification') {
      contentUpdateAnswer = this.identification;
    }
    if (this.contentAnswerType === 'multiple-choice') {
      const a = typeof this.idA === 'string' ? `"${ this.idA }"` : this.idA;
      const b = typeof this.idB === 'string' ? `"${ this.idB }"` : this.idB;
      const c = typeof this.idC === 'string' ? `"${ this.idC }"` : this.idC
      contentUpdateChoices = `[${ [a, b, c].join(',') }]`;
      contentUpdateAnswer = this.multipleChoice;
    }
    if (this.contentAnswerType === 'true-or-false') {
      contentUpdateAnswer = this.trueOrFalse;
    }
    if ((/^\s*$/).test(editorContent)) {
      this.toastMessage('Question should not be empty.');
      return;
    }
    if (this.contentAnswerType === 'multiple-choice' && (/^\s*$/).test(contentUpdateChoices)) {
      this.toastMessage('Choices should not be empty.');
      return;
    }
    if ((/^\s*$/).test(contentUpdateAnswer)) {
      this.toastMessage('Answer should not be empty.');
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
    this.http.post(`${ api.host }/question/create`, question, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.fetchLessonQuestions();
        this.cancelUpdate();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  updateQuestion (event: any, question: Object): void {
    this.contentUpdateDifficulty = question['difficulty_id'];
    this.contentUpdateType = question['question_type_id'];
    this.contentUpdateRange = question['question_range_id'];
    this.editorContent = question['question_content']['changingThisBreaksApplicationSecurity'];
    this.questionUpdateId = question['question_id'];
    this.questionUpdateStatus = question['question_status'];
    const index = this.questionTypeList.findIndex(type => type['question_type_id'] === question['question_type_id']);
    const type = this.questionTypeList[index]['question_type_slog'];
    this.contentAnswerType = type
    this.isUpdate = true;
    switch (type) {
      case 'multiple-choice':
        const choices = eval(question['answer_choices']);
        this.idA = choices[0];
        this.idB = choices[1];
        this.idC = choices[2];
        this.multipleChoice = question['answer_key'];
        break;
      case 'drag-and-drop':
        this.dragAndDrop = question['answer_key'];
        break;
      case 'identification':
        this.identification = question['answer_key'];
        break;
      case 'true-or-false':
        this.trueOrFalse = question['answer_key'];
        break;
      default:
        this.dragAndDrop = '';
        this.identification = '';
        this.multipleChoice = '';
        this.trueOrFalse = '';
    }
  }

  updateProceed (): void {
    let contentUpdateChoices = '';
    let contentUpdateAnswer = '';
    if (this.contentAnswerType === 'true-or-false') {
      contentUpdateAnswer = this.trueOrFalse;
    } else if (this.contentAnswerType === 'identification') {
      contentUpdateAnswer = this.identification;
    } else if (this.contentAnswerType === 'multiple-choice') {
      const a = typeof this.idA === 'string' ? `"${ this.idA }"` : this.idA;
      const b = typeof this.idB === 'string' ? `"${ this.idB }"` : this.idB;
      const c = typeof this.idC === 'string' ? `"${ this.idC }"` : this.idC
      contentUpdateChoices = `[${ [a, b, c].join(',') }]`;
      if ((/^\s*$/).test(contentUpdateChoices)) {
        this.toastMessage('Choices should not be empty.');
        return;
      }
      contentUpdateAnswer = this.multipleChoice;
    } else {
      this.toastMessage('Question type not supported yet.');
      return;
    }
    const editorContent = this.editorContent;
    if ((/^\s*$/).test(editorContent)) {
      this.toastMessage('Question should not be empty.');
      return;
    }
    if ((/^\s*$/).test(contentUpdateAnswer)) {
      this.toastMessage('Answer should not be empty.');
      return;
    }
    const questionDetails = {
      question_range_id: this.contentUpdateRange,
      question_type_id: this.contentUpdateType,
      difficulty_id: this.contentUpdateDifficulty,
      question_content: editorContent,
      question_status: this.questionUpdateStatus,
      answer_choices: contentUpdateChoices,
      answer_key: contentUpdateAnswer
    };
    this.http.put(`${ api.host }/question/${ this.questionUpdateId }`, questionDetails, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      this.toastMessage(response['message'], response['success']);
      if (response['success']) {
        this.cancelUpdate();
        this.fetchLessonQuestions();
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  cancelUpdate () {
    if (this.questionDiffcultiesCount > 0) {
      this.contentUpdateDifficulty = 1;
    }
    if (this.questionTypeCount > 0) {
      this.contentUpdateType = this.cloneUpdateType;
    }
    if (this.questionRangeCount > 0) {
      this.contentUpdateRange = 0;
    }
    if (this.contentAnswerType === 'multiple-choice') {
      this.idA = '';
      this.idB = '';
      this.idC = '';
    }
    this.isUpdate = false;
    this.editorContent = '';
    this.contentAnswerType = 'drag-and-drop';
    this.dragAndDrop = '';
    this.identification = '';
    this.multipleChoice = '';
    this.trueOrFalse = '';
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
              this.fetchLessonQuestions();
            }, error => this.toastMessage(error['message'], error['success']));
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  viewAll (): void {
    this.sortStatus = 1;
    this.sortRange = 0;
    this.sortDifficulty = 1;
    this.fetchLessonQuestions();
  }

  fetchLessonQuestions (): void {
    const sort = `?difficulty=${ this.sortDifficulty }&range=${ this.sortRange }&status=${ this.sortStatus }`;
    this.http.get(`${ api.host }/question/lists/${ this.lesson['lesson_id'] }${ sort }`).subscribe(response => {
      if (response['success'] && response['questions']) {
        this.questionsList = response['questions'].map(question => {
          question['question_content'] = this.sanitize.bypassSecurityTrustHtml(question['question_content']);
          return question;
        });
        this.questionsCount = response['questions']['length'];
        return;
      }
      this.questionsCount = 0;
    }, error => this.toastMessage(error['message'], error['success']));
  }

  fetchQuestionDifficulty (): void {
    this.http.get(`${ api.host }/difficulty/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success'] && response['difficulties']) {
        this.questionDiffcultiesList = response['difficulties'];
        this.contentUpdateDifficulty = response['difficulties'][0]['difficulty_id'];
        this.questionDiffcultiesCount = response['difficulties']['length'];
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  fetchQuestionType (): void {
    this.http.get(`${ api.host }/question-type/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success'] && response['question_types']) {
        this.questionTypeList = response['question_types'];
        this.contentUpdateType = response['question_types'][0]['question_type_id'];
        this.cloneUpdateType = this.contentUpdateType;
        this.questionTypeCount = response['question_types']['length'];
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

  fetchQuestionRange (): void {
    this.http.get(`${ api.host }/question-range/lists`, {
      headers: new HttpHeaders().set('Authorization', this.user['token'])
    }).subscribe(response => {
      if (response['success'] && response['question_ranges']) {
        this.questionRangeList = response['question_ranges'];
        this.contentUpdateRange = 0;
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
        this.fetchLessonQuestions();
        this.showChoicesAndAnswer(this.contentUpdateType);
      });
    });
  }

}
