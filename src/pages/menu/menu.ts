import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { SafetyPage } from '../safety/safety';
import { ProjectPage } from '../project/project';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { SupportPage } from '../support/support';
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public importedData:any ;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public stemAPI: StemApiProvider,
              public reap: ReapService,
              public storage: Storage) {
     /* calls local storage once user hits menupage*/

     if(LoginPage.initialLogin==true){
        //console.log('Initial Login is:',LoginPage.initialLogin);
       this.storage.get('authToken').then((data)=>{
       if(data!=null){
       //console.log('GET request happened');
       this.reap.grabAPIData(data);//calls service to grab API data on initial login
        }
     });
    }
    else{
      this.reap.getLocalStorage();
      //console.log('Initial Login is:',LoginPage.initialLogin);
    }
  }

  toSaftey(){
    this.navCtrl.push(SafetyPage);
  }
  toProject(){
    this.navCtrl.push(ProjectPage);
  }
  toSupport(){
    this.navCtrl.push(SupportPage);
  }

}
