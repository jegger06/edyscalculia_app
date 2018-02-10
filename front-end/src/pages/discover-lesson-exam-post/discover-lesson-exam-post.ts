import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the DiscoverLessonExamPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discover-lesson-exam-post',
  templateUrl: 'discover-lesson-exam-post.html',
})
export class DiscoverLessonExamPostPage {

  user: Object = {};

  constructor (
    public navCtrl: NavController,
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

  ionViewWillEnter (): void {
    this.storage.get('account').then(response => {
      if (response) {
        this.user = response;
        return;
      }
    }, error => this.toastMessage(error['message'], error['success']));
  }

}
