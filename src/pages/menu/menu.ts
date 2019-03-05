import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { FieldTicketPage } from '../field-ticket/field-ticket';
import { ProjectPage } from '../project/project';
import { WellLocationsPage } from '../well-locations/well-locations';
import { ReapService } from '../../services/reap-service';
import { StemApiProvider } from '../../providers/stem-api/stem-api';
import { SupportPage } from '../support/support';
import { ManageCrewPage } from '../manage-crew/manage-crew';
import { EmployeeSignaturesPage } from '../employee-signatures/employee-signatures'
import { JsaPage } from '../jsa/jsa';
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public importedData:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public stemAPI: StemApiProvider,
              public reap: ReapService,
              public storage: Storage,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {

  }
  ionViewWillEnter(){
      this.storage.get('authToken').then((data)=>{
      if(data!=null){
        this.reap.token = data;
          this.storage.get('groupName').then((data)=>{
            this.reap.groupName = data
            if(data!=null){//grabs groupId login
              this.reap.grabAPIData(this.reap.token,this.reap.groupName);
              this.reap.getLocalStorage();
            }
            else{//If no Group name is saved from login
              this.reap.groupName = "";
              this.reap.grabAPIData(this.reap.token,this.reap.groupName);
              this.reap.getLocalStorage();
            }
         },err=>{
           console.log('How`d you get here?'+err);
         });
       }
       else{
         this.reap.presentToast('Sync Unsuccessful');
       }
    },err=>{
      console.log('How`d you get here?'+err);
    });
    //fixes issue with signature swiping back.
    this.navCtrl.swipeBackEnabled = false;
  }

  toFieldTicket(){
    //console.log(this.reap.formStart);
      // if(this.reap.formStart==false){//checks if there is not a variable stored in local storage
      //   let loading = this.loadingCtrl.create({
      //     content: 'Starting New Field Ticket'
      //    });
      //   loading.present();
      //       this.reap.formStart = true;//starts the new Form
      //       //Creates Time Stamp for form
      //       var getTimeStart:any = new Date().toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");
      //       //saves start time and formstart in local storage
      //       this.storage.set('formStart',this.reap.formStart);//sets local storage
      //       this.storage.set('getTimeStart',getTimeStart);
      //       this.reap.formStartTime = getTimeStart;
      //   setTimeout(() => {
      //     loading.dismiss();
      //     this.navCtrl.push(FieldTicketPage);
      //   }, 1000);
      // }
      // else{// pushed straight to Safety Page if user had previously submitted an initial Safety Form
        this.navCtrl.push(FieldTicketPage);
     // }
  }//end function
  toJSA(){
    this.navCtrl.push(JsaPage);
  }
  toProject(){
    this.navCtrl.push(ProjectPage);
  }
  toSupport(){
    this.navCtrl.push(SupportPage);
  }
  toWellLocations(){
    this.navCtrl.push(WellLocationsPage);
  }
  toManageCrew(){
    this.navCtrl.push(ManageCrewPage);
  }
  toEmployeeSignatures(){
    this.navCtrl.push(EmployeeSignaturesPage);
  }
}
