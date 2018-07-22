import { Component, OnInit } from '@angular/core';
import {ChartService} from'../../services/chart.service';
import {single} from './data';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  single:any=[];

  view: any[] = [700, 400];

  // options
  showLegend = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  gradient=false;



  constructor(private chartService:ChartService) {
  }

  ngOnInit() {
    this.chartService.getAllPost().subscribe(getBlog=>{
      single.length=0;
      var blogData=getBlog.blogs;
      for(var i=0;i<blogData.length;i++){
        var data= {
          "name": blogData[i].createdBy,
          "value": blogData[i].comments.length
        }
        console.log(single);
        single.push(data);
      }
      Object.assign(this, {single})
    })

  }

}
