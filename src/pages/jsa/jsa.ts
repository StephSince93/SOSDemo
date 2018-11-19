import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Platform } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';

import { ReapService } from '../../services/reap-service';
import { ProjectReviewPage } from '../project-review/project-review';
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
  selector: 'page-jsa',
  templateUrl: 'jsa.html',
})
export class JsaPage {
  private locationsArray: Location[];
  location: Location;
  updatedLocation: updatedLocation[];
  updatedlocation: updatedLocation;
/**************************************************************/
  private userLocation:any = [];
  private wellLocation: any [] = [];
  private selectedClosestLoc:boolean = false;
  private afeArray:any[] = this.reap.getAFE;
  currentDate:any = new Date().toISOString();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              private platform: Platform) {
    this.locationsArray = reap.getLocations;
    this.updatedLocation = [];
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

      onSubmit(Form: NgForm){
        if(!Form.value.Location){//If user grabs nearest location
          Form.value.Location = Form.value.updatedLocation;
          // console.log(Form.value.Location);
          // Form.removeControl['updatedLocation'];
          // console.log(Form.controls)
        }
        this.reap.projectForm = Form.value;
        //console.log(this.reap.projectForm);
//this.navCtrl.push(ProjectReviewPage);
      }
      searchableChange(event: { component: SelectSearchableComponent, value: any }) {
            //console.log('value:', event.value);
        }
          resetLocation(){
              this.wellLocation = [];
              this.updatedLocation = [];
              this.selectedClosestLoc = false;
          }
}