import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform,AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Geolocation } from '@ionic-native/geolocation';

import { SubMenuPage } from '../sub-menu/sub-menu';
import { ReapService } from '../../services/reap-service';
import { FieldTicketReviewPage } from '../field-ticket-review/field-ticket-review';

class Location {
  public ID: number;
  public Location: string;
}
class updatedLocation {
  public ID: number;
  public Location: string;
}
@IonicPage()
@Component({
  selector: 'page-field-ticket',
  templateUrl: 'field-ticket.html',
})

export class FieldTicketPage {
  private locationsArray: Location[];
  location: Location;
  updatedLocation: updatedLocation[];
  updatedlocation: updatedLocation;
/**************************************************************/
  private userLocation:any = [];
  private wellLocation: any [] = [];
  private selectedClosestLoc:boolean = false;
  private afeArray:any[] = this.reap.getAFE;
  private projectArray:any[] = this.reap.getProject;
  private personnelArray:any[] = [];
  private selectedArray:any[] = [];//saves array selected from projects
  private projectSelected:boolean = false;
  private afeString:string;//stores AFE from selected project number
  private startDate:any;
  private foreman:string;//current user logged in
  private personnelSelected:boolean = false;//check to see if user selected exists
  currentDate:any = new Date().toISOString();
  defaultStartTime:string = new Date(new Date().setHours(-1, 0, 0)).toISOString();
  defaultEndTime:string = new Date(new Date().setHours(13, 0, 0)).toISOString();
  // defaultStartTime:any = new Date (new Date().toDateString() + ' ' + '11:00 PM').toISOString();
  // defaultEndTime:any = new Date (new Date().toDateString() + ' ' + '1:00 PM').toISOString();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private platform: Platform,
              private alertCtrl: AlertController) {
        this.personnelArray = this.reap.getPersonnel;
        this.locationsArray = reap.getLocations;
        this.updatedLocation = [];
        //console.log(this.projectArray);
        /**************** Catch Error ************/
  }
  ionViewWillEnter(){
    for(let i=0;i< this.personnelArray.length;i++){//grabs current username logged in
        if(this.personnelArray[i]['default'] === "true"){
          this.foreman = this.personnelArray[i]['FullName'];
          //console.log(this.personnel);
        }
      }
  }
  projectSelect(project,i){
    //console.log(i);
    this.selectedArray = this.projectArray[i];
    this.afeString = this.selectedArray['AFE_Number'];
    //console.log(this.afeString)
    this.projectSelected = true;
  }

  onSubmit(Form: NgForm){
    var sT = new Date(Form.value.startTime);
    var eT = new Date(Form.value.endTime);
    var sTHours = sT.getUTCHours();
    var sTMinutes = sT.getUTCMinutes();
    var eTHours = eT.getUTCHours();
    var eTMinutes = eT.getUTCMinutes();
    //Changes form value back to normal time
    if(sT.getUTCMinutes()==0){
    Form.value.startTime = (sT.getUTCHours() +':' + sT.getUTCMinutes() + sT.getUTCMinutes() +' AM').toString();
    }
    else{
      Form.value.startTime = (sT.getUTCHours() +':' + sT.getUTCMinutes() +' AM').toString();
    }
    if(eT.getUTCMinutes()==0){
      if(eT.getUTCHours()>12){
        Form.value.endTime = (eT.getUTCHours()-12 +':' + eT.getUTCMinutes() + eT.getUTCMinutes() +' PM').toString();
      }
      else{
        Form.value.endTime = (eT.getUTCHours() +':' + eT.getUTCMinutes() + eT.getUTCMinutes() +' PM').toString();
      }
    }
    else{
      Form.value.endTime = (eT.getUTCHours() +':' + eT.getUTCMinutes() +' PM').toString();
    }
    // console.log(Form.value.startTime);
    // console.log(Form.value.endTime);
    var totalHours = eTHours - sTHours;
    var totalMinutes = ((eTMinutes - sTMinutes) /60);
    // console.log('hours: ' + totalHours);
    // console.log('minutes: ' + (totalMinutes / 60));
    var totalTime = (totalHours + totalMinutes);
    // console.log(totalHours + totalMinutes);
    // console.log('total time: ' + totalTime);
    //this.reap.totalTime = totalTime;
    if(totalTime < 0){
      //console.log('Starting Time is greater than Ending Time');
      this.presentAlert();
    }
    else{
      //Updates Labor Array with total hours worked on form fields
      if(!Array.isArray(this.reap.globalCrewPersonnel) || !this.reap.globalCrewPersonnel.length){}
       else{
         for(let i=0;i<this.reap.globalCrewPersonnel.length;i++){
           this.reap.globalCrewPersonnel[i]={'ID':this.reap.globalCrewPersonnel[i]['ID']
                     ,'FullName':this.reap.globalCrewPersonnel[i]['FullName']
                     ,'Hours':totalTime.toString()};
            }
         }
    //console.log(this.reap.globalCrewPersonnel);
    //Created form value as foreman
    Form.value.foreman = this.foreman;
    Form.value.formStartTime = this.reap.formStartTime;
    //console.log(Form.value);
    if(!Form.value.Location){//If user grabs nearest location
      Form.value.Location = Form.value.updatedLocation;
      if(Form.value.Location){
        this.reap.selectedCompany = Form.value.Location['CID'];
      }
      //Form.value.remove.updatedLocation;
    }
    if(Form.value.Location){
      this.reap.selectedCompany = Form.value.Location['CID'];
    }
    this.reap.safetyForm = Form.value;
    //console.log(this.reap.safetyForm);
    this.navCtrl.push(SubMenuPage);
    }
  }
  grabLocation(){
        this.selectedClosestLoc = true;
        /* Ensure the platform is ready */
        this.platform.ready().then(() => {
        /* Grabs user geolocation */
        this.geolocation.getCurrentPosition().then((resp) => {
            // 4 decimal places
            this.userLocation = [parseFloat(resp.coords.latitude.toFixed(4)),parseFloat(resp.coords.longitude.toFixed(4))];
            //100% accurate
            this.userLocation = [resp.coords.latitude,resp.coords.longitude];
            //var t0 = performance.now();
            this.reap.grabUserLoc(resp.coords.latitude,resp.coords.longitude);
            //var t1 = performance.now();
            //console.log("Call to grabUserLoc took " + (t1 - t0) + " milliseconds.");
            this.updatedLocation = this.reap.updatedLocation;

            //console.log(this.updatedLocation);
          }).catch((error) => {
            //console.log('Error getting location', error);
            this.reap.presentToast(error);
          });
        });
      }
  searchableChange(event: { component: SelectSearchableComponent, value: any }) {
        //console.log('value:', event.value);
    }
    resetLocation(){
        this.wellLocation = [];
        this.updatedLocation = [];
        this.selectedClosestLoc = false;
    }

    presentAlert() {
      let alert = this.alertCtrl.create({
        title: 'Time Mismatch',
        subTitle: 'Start Time is greater than End Time',
        buttons: ['Dismiss']
      });
  alert.present();
}
}