import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'HomePage';

  navItem: Array<{ icon: string, link: string, text: string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.navItem = [
      { icon: 'logo-buffer', link: 'DashboardPage', text: 'Dashboard' },
      { icon: 'md-paper', link: 'ChapterPage', text: 'Chapter' },
      { icon: 'md-star', link: 'TopScorePage', text: 'Top Score' },
      { icon: 'md-people', link: 'AccountsPage', text: 'Accounts' },
      { icon: 'md-exit', link: 'LogoutPage', text: 'Logout' }
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goTo (link) {
    console.log(link)
  }

}

