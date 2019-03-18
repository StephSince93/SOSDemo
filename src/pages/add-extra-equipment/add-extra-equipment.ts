import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { NgForm } from '@angular/forms';

import { ReapService } from '../../services/reap-service';

class EquipmentList {
  public ID: number;
  public Name:string;
  public Name2: string;
}

@IonicPage()
@Component({
  selector: 'page-add-extra-equipment',
  templateUrl: 'add-extra-equipment.html',
})
export class AddExtraEquipmentPage {
  public extraEquipmentArray: EquipmentList[];
  equipment: EquipmentList;
  private noSubmission:boolean = true;
  private jobCost:any;
  private tempEquipment:any [] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public reap: ReapService,
              public viewCtrl: ViewController) {
                try{
                if(this.reap.selectedJob!=null){
                  this.jobCost=this.reap.selectedJob['Cost_Center_Code'];
                  console.log(this.reap.selectedJob['Cost_Center_Code']);
      for(let key in this.reap.getEquipment){
          if(this.reap.getEquipment[key]['Cost_Center']===this.jobCost){
          //console.log(this.reap.getEquipment[key]);
          this.tempEquipment.push(this.reap.getEquipment[key]);
          }
        }
      }
      this.extraEquipmentArray = this.tempEquipment;
    }catch{
    this.reap.presentAlert('Error','Error Grabbing API data, please re-sync in settings','Dismiss')
      this.viewCtrl.dismiss(this.noSubmission);
    }
  }

  submitEquipment(form: NgForm){
    //console.log(form.value);
     this.viewCtrl.dismiss(form.value);
  }

  equipmentChange(event: { component: SelectSearchableComponent, value: any }) {
          //console.log('value:', event.value);
          //console.log(this.globalEquipment);
  }
  dismissModal(){
     this.viewCtrl.dismiss(this.noSubmission);
  }
}
