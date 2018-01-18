import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminTopscorePage } from './admin-topscore';

@NgModule({
  declarations: [
    AdminTopscorePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminTopscorePage),
  ],
})
export class AdminTopscorePageModule {}
