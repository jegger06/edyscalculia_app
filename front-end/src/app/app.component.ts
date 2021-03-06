import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { App } from 'ionic-angular/components/app/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = 'HomePage';

  navItem: Array<{ icon: string, link: string, text: string }>;

  constructor(
    app: App,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public storage: Storage) {
    this.navItem = [
      { icon: 'md-person', link: 'ProfilePage', text: 'Profile' },
      { icon: 'logo-buffer', link: 'AdminDashboardPage', text: 'Dashboard' },
      { icon: 'md-paper', link: 'AdminChapterPage', text: 'Chapters' },
      { icon: 'md-star', link: 'AdminTopscorePage', text: 'Top Scores' },
      { icon: 'md-people', link: 'AdminAccountsPage', text: 'Accounts' },
      { icon: 'md-settings', link: 'AdminSettingsPage', text: 'Settings' },
      { icon: 'md-exit', link: 'LogOutPage', text: 'Logout' }
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(() => {
        app.navPop();
      });
    });
  }

  goTo(link) {
    this.menuCtrl.close();
    this.rootPage = link;
  }

}

