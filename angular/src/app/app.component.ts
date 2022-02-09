import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import {HttpService} from './http.service'
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Windbarb from 'highcharts/modules/windbarb';
import { trigger, transition, animate, style } from '@angular/animations'
import { AgmMap } from '@agm/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'

Windbarb(Highcharts);
HighchartsMore(Highcharts);
declare function init(json:any,container:any): any;
declare function deleteall():any;
// declare var chartjson:JSON;
declare var winds:string[];
declare var temperatures:string[];
declare var pressures:string[];
declare var humidity:number[];

@Component({
  selector: 'app-root',
  template:`
    <highcharts-chart 
      [Highcharts]="Highcharts"
      [options]="chartOptions"

      style="width: 100%; height: 400px; display: block;"
    ></highcharts-chart>
  `,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideOutIn', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class AppComponent  {
  @ViewChild('progressbar1') pBar:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('street') street:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('city') city:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('state') state:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('favoritebutton') favoritebutton:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('daytab') daytab:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('temptab') temptab:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('meteogramtab') meteogramtab:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('tworesult') tworesult:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('twofavorites') twofavorites:ElementRef<HTMLInputElement>={} as ElementRef;
  @ViewChild('city', { read: MatAutocompleteTrigger}) ac: ElementRef<MatAutocompleteTrigger>={} as ElementRef;

  statejson=[["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","District Of Columbia"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]]
  week=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
  month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  tagweather=[["4201","Heavy Rain"],["4001","Rain"],["4200","Light Rain"],["6201","Heavy Freezing Rain"],
  ["6001","Freezing Rai"],["6200","Light Freezing Rain"],["6000","Freezing Drizzle"],
  ["4000","Drizzle"],["7101","Heavy Ice Pellet"],["7000","Ice Pellets"],
  ["7102","Light Ice Pellets"],["5101","Heavy Snow"],["5000","Snow"],["5100","Light Snow"],
  ["5001","Flurries"],["8000","Thunderstorm"],["2100","Light Fog"],["2000","Fog"],["1001","Cloudy"],
  ["1102","Mostly Cloudy"],["1101","Partly Cloudy"],["1100","Mostly Clear"],["1000","Clear"]]
  codetoimg=[["0","Unknown"],["1000", "clear_day.svg"],["1001", "cloudy.svg"],["1100", "mostly_clear_day.svg"],[
    "1101", "partly_cloudy_day.svg"],["1102", "mostly_cloudy.svg"],["2000", "fog.svg"],["2100", "fog_light.svg"],["3000", "light_wind.jpg"],[
    "3001", "wind.png"],["3002", "strong-wind.png"],["4000", "drizzle.svg"],["4001", "rain.svg"],["4200", "rain_light.svg"],[
    "4201", "rain_heavy.svg"],["5000", "snow.svg"],["5001", "flurries.svg"],["5100", "snow_light.svg"],["5101", "snow_heavy.svg"],[
    "6000", "freezing_drizzle.svg"],["6001", "freezing_rain.svg"],["6200", "freezing_rain_light.svg"],["6201", "freezing_rain_heavy.svg"],[
    "7000", "ice_pellets.svg"],["7101", "ice_pellets_heavy.svg"],["7102", "ice_pellets_light.svg"],["8000", "tstorm.svg"]];  


  // title = 'angularhw8';
  // pandora="no vip";
  // bankname="as";
  // testchoose=true;
  // testmsg = '';
  showprogressbar=false;
  showcountylabel=false;
  latitude=0.0;
  longtitude=0.0;
  streettext='';
  citytext='';
  statetext='';
  showstreetalert=false;
  showcityalert=false;
  showresult=false;
  svgchange=false;
  buttonavaliable1=false;
  buttonavaliable2=false;
  buttonavaliable3=false;
  showtabview=1;
  whentocall=0
  weatherinfolist:string[][]=[];
  weatherdetails:string[]=[];
  items=new Set();
  resorfav=1;
  fav=true;
  ranges:number[][]=[];
  showdetails=false;
  // favlist=[["Los Angeles","Los angeles County","34","-118"],["New York","New York","118","67"]];
  favlist:string[][]=[];
  detailnum=0;

  zoom:number=16;
  options:string[][]=[["Los Angeles","CA"],["New York","New York"]];
  // control = new FormControl();
  auto="on";
  
  showresultparent=false;
  showdetailsparent=false;
  showerror=false;

  winds = [];
  temperatures = [];
  pressures = [];
  humidity = [];
  selected='';
 
  constructor(private httpService: HttpService){}

  gotwitter(){
    // this.streettext='hhh'
    // this.citytext="kkk"
    // this.statetext="CA"
    // this.weatherinfolist.push(['1','2','3','4','5','6','7','8','9','10','11','12','13']);
    let twitterurl="https://twitter.com/intent/tweet?text="+"The temperature in "+
                    this.streettext+" "+this.citytext+" "+this.statetext+" on "+
                    this.weatherinfolist[0][6]+" is "+this.weatherinfolist[0][12]+"°F. "+
                    "The weather conditions are "+this.weatherinfolist[0][10]+" %23CSCI571WeatherForecast"+"&id=9";
    // let twitterurl="https://www.google.com"
    window.open(twitterurl, "_blank");

  }
  clearall(){
    this.showprogressbar=false;
    this.showcountylabel=false;
    this.latitude=0.0;
    this.longtitude=0.0;
    this.streettext='';
    this.citytext='';
    this.statetext='';
    this.showstreetalert=false;
    this.showcityalert=false;
    this.showresult=false;
    this.svgchange=false;
    this.buttonavaliable1=false;
    this.buttonavaliable2=false;
    this.buttonavaliable3=false;
    this.showtabview=1;
    this.whentocall=0
    this.weatherinfolist=[];
    this.weatherdetails=[];
    this.items=new Set();
    this.resorfav=1;
    this.fav=true;
    this.ranges=[];
    this.showdetails=false;
    // this.favlist=[];
    this.detailnum=0;
    this.zoom=16;
    this.options=[];
    this.auto="on";
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];
    this.humidity = [];
    this.selected='';
    this.showresultparent=false;
    this.showdetailsparent=false;
    this.tworesult.nativeElement.className="btn btn-primary";
    this.twofavorites.nativeElement.className="btn btn-link";
    this.city.nativeElement.value="";
    this.street.nativeElement.value="";
    this.state.nativeElement.value="Select your state";
    this.showerror=false;
    deleteall();
  }
  toDetails(){
    this.showresult=false;
    this.showresultparent=false;
    this.showcountylabel=false;
    this.showdetails=true;
    this.showdetailsparent=true;
  }
  toList(){
    this.showresultparent=true;
    this.showresult=true;
    
    this.showcountylabel=true;
    this.showdetails=false;
    this.showdetailsparent=false;
  }
  currentdetail(elementid:any){
    this.detailnum=elementid;
    this.showdetailsparent=true;
    this.showprogressbar=false;
    this.showresult=false;
    this.showdetails=true;
    this.showcountylabel=false;
    
  }
  detail(elementid:any){
    this.detailnum=elementid;
    this.latitude=parseFloat(this.favlist[this.detailnum][2]);
    this.longtitude=parseFloat(this.favlist[this.detailnum][3]);
    this.streettext=this.street.nativeElement.value;
    this.citytext=this.city.nativeElement.value;
    this.statetext=this.state.nativeElement.value;
    this.httpService.getReq1(this.favlist[this.detailnum][2],this.favlist[this.detailnum][3]).subscribe(weatherdata=>{
      try { 
        var weatherjson=JSON.parse(JSON.stringify(weatherdata)).data.timelines[0];
      } catch(e) {
        if (e instanceof TypeError) {
          this.showerror=true;
          // alert("An error occured please try again later");
        } 
      }
      for(let i=0;i<weatherjson.intervals.length;i++){
        this.weatherinfolist.push([ weatherjson.intervals[i].values.humidity,
                                    weatherjson.intervals[i].values.windSpeed,
                                    weatherjson.intervals[i].values.visibility,
                                    weatherjson.intervals[i].values.temperatureMin,
                                    weatherjson.intervals[i].values.temperatureMax,
                                    weatherjson.intervals[i].values.weatherCode,
                                    weatherjson.intervals[i].values.sunriseTime,
                                    weatherjson.intervals[i].values.sunsetTime,
                                    weatherjson.intervals[i].values.precipitationProbability,
                                    weatherjson.intervals[i].values.precipitationType,
                                    '',
                                    weatherjson.intervals[i].values.cloudCover,
                                    weatherjson.intervals[i].values.temperature,
                                    weatherjson.intervals[i].values.sunriseTime//sunrise
                                  ]);
      }
      this.streettext= this.street.nativeElement.value;
      this.citytext= this.city.nativeElement.value;
      for(var val of this.statejson){
        if(val[0]==this.state.nativeElement.value){
          this.statetext= val[1];
          break;
        }
      }
      for(let i = 0; i < weatherjson.intervals.length; i++){
        var day = new Date(this.weatherinfolist[i][6].substring(0, 10));
        this.weatherinfolist[i][6]=this.week[day.getDay()]+", "+this.weatherinfolist[i][6].substring(8, 10)+" "+
                    this.month[day.getMonth()]+" "+this.weatherinfolist[i][6].substring(0, 4);
        for(let j=0;j<this.tagweather.length;j++){
          if(this.tagweather[j][0]==this.weatherinfolist[i][5]){
            this.weatherinfolist[i][10]=this.tagweather[j][1];
          }
        }
        this.weatherinfolist[i][4]=(parseFloat(this.weatherinfolist[i][4])*9/5+32).toFixed(2)
        this.weatherinfolist[i][3]=(parseFloat(this.weatherinfolist[i][3])*9/5+32).toFixed(2)  
        for(let j=0;j<this.codetoimg.length;j++){
          if(this.codetoimg[j][0]==this.weatherinfolist[i][5]){
            this.weatherinfolist[i][5]=this.codetoimg[j][1];
          }
        }
      }
      this.weatherinfolist.splice(14, 100);
      // highcharts
      for(let i=0;i<this.weatherinfolist.length;i++){
        let timenow=new Date(this.weatherinfolist[i][6]);
        let lowtemp=(+this.weatherinfolist[i][3]*9/5+32).toFixed(2);
        let hightemp=(+this.weatherinfolist[i][4]*9/5+32).toFixed(2);
        this.ranges.push([timenow.getTime(),parseInt(lowtemp),parseInt(hightemp)]);
      }

    });
    this.showdetailsparent=true;
    this.showprogressbar=false;
    this.resorfav=1;
    this.showresult=false;
    this.showdetails=true;
    this.showcountylabel=false;
  }
  removecurrent(elementid:any){
    if(this.svgchange==true && elementid==this.favlist.length-1){
      this.svgchange=false;
    }
    this.favlist.splice(elementid,1);
    if(this.favlist.length==0){
      localStorage.clear();
      this.fav=false;
    }else{
      localStorage.clear();
      let s=''
      for(let i in this.favlist){
        if(i=='0')
          s=this.favlist[i][0]+','+this.favlist[i][1]+','+this.favlist[i][2]+','+this.favlist[i][3];
        else
          s=s+'_'+this.favlist[i][0]+','+this.favlist[i][1]+','+this.favlist[i][2]+','+this.favlist[i][3];
      }
      localStorage.setItem("favorite", s);
    }  
  }
  changeToResult(){
    this.resorfav=1;
    if(this.citytext!=""&&this.statetext!=""){
      this.showresult=true;
      this.showresultparent=true;
      this.showdetailsparent=false;
      this.showcountylabel=true;
    }
    this.tworesult.nativeElement.className="btn btn-primary";
    this.twofavorites.nativeElement.className="btn btn-link";
  }
  togglefavorite(){
    if(this.svgchange==false){
      if(this.favlist.length==0){
        this.favlist.push([this.citytext,
                          this.statetext,
                          this.latitude.toString(),
                          this.longtitude.toString()])
      }else{ 
        for(let i in this.favlist){
          if(this.favlist[i][2]!=this.latitude.toString() || this.favlist[i][3]!=this.longtitude.toString())
          {
            //add favorite
            this.favlist.push([this.citytext,
                              this.statetext,
                              this.latitude.toString(),
                              this.longtitude.toString()])
          }
        }

      }
     
     
     
      let s=''
      for(let i in this.favlist){
        if(i=='0')
          s=this.favlist[i][0]+','+this.favlist[i][1]+','+this.favlist[i][2]+','+this.favlist[i][3];
        else
          s=s+'_'+this.favlist[i][0]+','+this.favlist[i][1]+','+this.favlist[i][2]+','+this.favlist[i][3];
      }
      localStorage.setItem("favorite", s);
      this.fav=true;
    }else{
      //remove
      this.favlist.splice(this.favlist.length-1,1);
      if(this.favlist.length==0) {
        localStorage.clear();
        this.fav=false;
      }else{
        localStorage.clear();
        let s=''
        for(let i in this.favlist){
          if(i=='0')
            s=this.favlist[i][0]+','+this.favlist[i][1]+','+this.favlist[i][2]+','+this.favlist[i][3];
          else
            s=s+'_'+this.favlist[i][0]+','+this.favlist[i][1]+','+this.favlist[i][2]+','+this.favlist[i][3];
        }
        localStorage.setItem("favorite", s);
      }
    }
    this.svgchange=!this.svgchange;
  }
  changeToFavorite(){
    // this.gotwitter();
    this.favlist=[]
    let out=localStorage.getItem("favorite")||"";
    
    for(let i in out.split('_'))
    {
      let element=out.split('_')[i].split(',');
      this.favlist.push([ element[0],
                          element[1],
                          element[2],
                          element[3]]);
    }
  
    this.resorfav=2;
    this.tworesult.nativeElement.className="btn btn-link";
    this.twofavorites.nativeElement.className="btn btn-primary";
    this.showresultparent=false;
    this.showdetailsparent=false;
    this.showcountylabel=false;
    this.showprogressbar=false;
  }
  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2 : Highcharts.Options={
    chart: {
        // renderTo: 'container',
        marginBottom: 70,
        marginRight: 40,
        marginTop: 50,
        plotBorderWidth: 1,
        height: 310,
        alignTicks: false,
        scrollablePlotArea: {
            minWidth: 720
        }
    },
    // defs: {
    //     patterns: [{
    //         id: 'precipitation-error',
    //         path: {
    //             d: [
    //                 'M', 3.3, 0, 'L', -6.7, 10,
    //                 'M', 6.7, 0, 'L', -3.3, 10,
    //                 'M', 10, 0, 'L', 0, 10,
    //                 'M', 13.3, 0, 'L', 3.3, 10,
    //                 'M', 16.7, 0, 'L', 6.7, 10
    //             ].join(' '),
    //             stroke: '#68CFE8',
    //             strokeWidth: 1
    //         }
    //     }]
    // },
    title: {
        text: 'Hourly Weather(For Next 5 Days)',
        align: 'center',
        style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }
    },
    tooltip: {
        shared: true,
        useHTML: true,
        headerFormat:
            '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
            '<b>{point.point.symbolName}</b><br>'
    },
    xAxis: [{ 
        type: 'datetime',
        tickInterval: 4 * 36e5, // two hours
        minorTickInterval: 36e5, // one hour
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        offset: 30,
        showLastLabel: true,
        labels: {
            format: '{value:%H}'
        },
        crosshair: true
    }, { // Top X axis
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
            format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
            align: 'left',
            x: 3,
            y: -5
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
    }],
    yAxis: [{ // temperature axis
        title: {
            text: null
        },
        labels: {
            format: '{value}°',
            style: {
                fontSize: '10px'
            },
            x: -3
        },
        plotLines: [{ // zero plane
            value: 0,
            color: '#BBBBBB',
            width: 1,
            zIndex: 2
        }],
        maxPadding: 0.3,
        minRange: 8,
        tickInterval: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)'

    }, { // precipitation axis
        title: {
            text: null
        },
        labels: {
            enabled: true
        },
        gridLineWidth: 0,
        tickLength: 0,
        minRange: 10,
        min: 0

    }, { // Air pressure
        allowDecimals: false,
        title: { // Title on top of axis
            text: 'inHg',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
                fontSize: '10px',
                color: '#fcd6a0'
            },
            textAlign: 'left',
            x: 3
        },
        labels: {
            style: {
                fontSize: '8px',
                color: '#fcd6a0'
            },
            y: 2,
            x: 3
        },
        gridLineWidth: 0,
        opposite: true,
        showLastLabel: false
    }],
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointPlacement: 'between',
        },
        column:{
            dataLabels: {
                enabled: true,
                style: {
                    fontSize:'6px',
                    fontWeight:"normal"
                }
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name:"Temperature",
        data: temperatures,
        type: 'spline',
        // marker: {
        //     enabled: false,
        //     states: {
        //         hover: {
        //             enabled: true
        //         }
        //     }
        // },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>{point.y}</b><br/>',
            valueSuffix: '°F'
        },
        zIndex: 1,
        color: '#FF3333',
        negativeColor: '#48AFE8'
    }, {
        name: 'Humidity',
        data: humidity,
        type: 'column',
        pointWidth:6,
        tooltip: {
            valueSuffix: '%'
        },
        states: {
          hover: {
              enabled: true
          }
        }
        
    }, {
        name: 'Air pressure',
        color: '#fcd6a0',
        data: pressures,
        type: 'spline',
        marker: {
            radius:1
        },
        shadow: false,
        tooltip: {
            valueSuffix: ' inHg'
        },
        dashStyle:'ShortDash',
        yAxis: 2
    }
    , {
        name: 'Wind',
        type: 'windbarb',
        data: winds,
        id: 'windbarbs',
        color: 'red',
        lineWidth: 1,
        vectorLength: 10,
        xOffset:-5,
        yOffset: -15,
        tooltip: {
            valueSuffix: ' mph'
        }
    }
  ]
  };

  Highcharts: typeof Highcharts = Highcharts;
  // HighchartsMore(Highcharts);
  // highcharts = Highcharts;
  chartOptions : Highcharts.Options ={
    title: {
      text: "Temperatures Ranges(Min,Max)"
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: {
            text: null
        }
    },
    tooltip: {
      // crosshairs: true,
      shared: true,
      valueSuffix: '°F'
    },
    series: [
    {
      name: 'Temperature',
      data: this.ranges,
      type: 'arearange',
      lineWidth: 1,
      linkedTo: ':previous',
      lineColor: "#fda616",
      fillColor: {
          linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
          },
          stops: [
              [0, "#fda616"],
              [0.7, "#dbe7f5"]
          ]
      },
      marker:{
          radius:3,
          color:"#dbe7f5"
      },
      fillOpacity: 0.3,
      zIndex: 0
    }]
  };

  streetvalid(val:any){
    if(val.target.value.length>0){
      this.buttonavaliable1=true;
    }
    if(val.target.value.length==0){
      this.buttonavaliable1=false;
    }
    if(this.street.nativeElement.value==""){
      this.showstreetalert=true;
      this.buttonavaliable1=false;
    }else{
      this.showstreetalert=false;
      this.buttonavaliable1=true;
    }
  }
  citytostate(val:any){
    for(let citystate of this.options){
      if(val==citystate[0]){
        this.state.nativeElement.value=citystate[1];
      }
    }
  }
  cityautocomplete(val:any){
    this.items.clear();
    this.options=[];
    this.whentocall=val.target.value.length;
    if(this.whentocall>0){this.buttonavaliable2=true;}
    if(this.whentocall==0){this.buttonavaliable2=false;}
    if(this.whentocall>=3){
      setTimeout(() => 
        this.httpService.getReq2(val.target.value).subscribe(data=>{
          for(var des of JSON.parse(JSON.stringify(data)).predictions){
            this.items.add(des.terms[0].value);
            this.options.push([des.terms[0].value,des.terms[1].value])
          }
      }), 1);
    }
    // this.citytostate();
    if(this.city.nativeElement.value==""){
      this.showcityalert=true;
      this.buttonavaliable2=false;
    }else{
      this.showcityalert=false;
      this.buttonavaliable2=true;
    }
    
  }
  tabchange(num:number){
    if(num==0){
      this.daytab.nativeElement.className="nav-link active";
      this.temptab.nativeElement.className="nav-link";
      this.meteogramtab.nativeElement.className="nav-link";
      this.showtabview=1;
    }else if(num==1){
      this.daytab.nativeElement.className="nav-link";
      this.temptab.nativeElement.className="nav-link active";
      this.meteogramtab.nativeElement.className="nav-link";
      this.showtabview=2;
    }else{
      this.daytab.nativeElement.className="nav-link";
      this.temptab.nativeElement.className="nav-link";
      this.meteogramtab.nativeElement.className="nav-link active";
      this.showtabview=3;
    }
  }
  
  checkstreetvalid(){
    if(this.street.nativeElement.value==""){
      this.showstreetalert=true;
      this.buttonavaliable1=false;
    }else{
      this.showstreetalert=false;
      this.buttonavaliable1=true;
    }
  }
  checkcityvalid(){
    if(this.city.nativeElement.value==""){
      this.showcityalert=true;
      this.buttonavaliable2=false;
    }else{
      this.showcityalert=false;
      this.buttonavaliable2=true;
    }
  }
 
  oncurrentlocation(e:any){
    if(e.target.checked){        
      this.street.nativeElement.disabled=true;
      this.city.nativeElement.disabled=true;
      this.state.nativeElement.disabled=true;
      this.showstreetalert=false;
      this.showcityalert=false;
      this.buttonavaliable1=true;
      this.buttonavaliable2=true;
      this.street.nativeElement.value="";
      this.city.nativeElement.value="";
      this.state.nativeElement.value="Select your state";
    }else{
      this.street.nativeElement.disabled=false;
      this.city.nativeElement.disabled=false;
      this.state.nativeElement.disabled=false;
      this.buttonavaliable1=false;
      this.buttonavaliable2=false;
    }
  }
  onreq() {
    // try {
      this.weatherinfolist=[];
      this.showprogressbar=true;
      this.svgchange=false;
      this.changeToResult();
      if(this.street.nativeElement.value=="" && this.city.nativeElement.value=="" && this.state.nativeElement.value=="Select your state"){
        var ipurl="https://ipinfo.io/162.250.92.109?token=e5c91910a8f4a1";
        this.httpService.getReq0(ipurl).subscribe(data=>{
          var ipcurobj=JSON.parse(JSON.stringify(data));
          this.latitude=parseFloat(ipcurobj.loc.split(',')[0]);
          this.longtitude=parseFloat(ipcurobj.loc.split(',')[1]);
          this.httpService.getReq1(this.latitude.toString(),this.longtitude.toString()).subscribe(weatherdata=>{
              try { 
                var weatherjson=JSON.parse(JSON.stringify(weatherdata)).data.timelines[0];
              } catch(e) {
                if (e instanceof TypeError) {
                  this.showerror=true;
                  // alert("An error occured please try again later");
                } 
              }
              for(let i=0;i<weatherjson.intervals.length;i++){
                this.weatherinfolist.push([ weatherjson.intervals[i].values.humidity,
                                            weatherjson.intervals[i].values.windSpeed,
                                            weatherjson.intervals[i].values.visibility,
                                            weatherjson.intervals[i].values.temperatureMin,
                                            weatherjson.intervals[i].values.temperatureMax,
                                            weatherjson.intervals[i].values.weatherCode,
                                            weatherjson.intervals[i].values.sunriseTime,
                                            weatherjson.intervals[i].values.sunsetTime,
                                            weatherjson.intervals[i].values.precipitationProbability,
                                            weatherjson.intervals[i].values.precipitationType,
                                            '',
                                            weatherjson.intervals[i].values.cloudCover,
                                            weatherjson.intervals[i].values.temperature,
                                            weatherjson.intervals[i].values.sunriseTime//sunrise
                                          ]);
              }
            
              this.streettext="";
              this.citytext= "Los Angeles";
              this.statetext="Los Angeles County";
              
              // console.log(this.weatherinfolist)

              //diver
              for(let i = 0; i < weatherjson.intervals.length; i++){
                var day = new Date(this.weatherinfolist[i][6].substring(0, 10));
                this.weatherinfolist[i][6]=this.week[day.getDay()]+", "+this.weatherinfolist[i][6].substring(8, 10)+" "+
                            this.month[day.getMonth()]+" "+this.weatherinfolist[i][6].substring(0, 4);
                for(let j=0;j<this.tagweather.length;j++){
                  if(this.tagweather[j][0]==this.weatherinfolist[i][5]){
                    this.weatherinfolist[i][10]=this.tagweather[j][1];
                  }
                }
                this.weatherinfolist[i][4]=(parseFloat(this.weatherinfolist[i][4])*9/5+32).toFixed(2)
                this.weatherinfolist[i][3]=(parseFloat(this.weatherinfolist[i][3])*9/5+32).toFixed(2)  
                for(let j=0;j<this.codetoimg.length;j++){
                  if(this.codetoimg[j][0]==this.weatherinfolist[i][5]){
                    this.weatherinfolist[i][5]=this.codetoimg[j][1];
                  }
                }
              }
              this.weatherinfolist.splice(14, 100);
              // highcharts
              for(let i=0;i<this.weatherinfolist.length;i++){
                let timenow=new Date(this.weatherinfolist[i][6]);
                let lowtemp=(+this.weatherinfolist[i][3]*9/5+32).toFixed(2);
                let hightemp=(+this.weatherinfolist[i][4]*9/5+32).toFixed(2);
                this.ranges.push([timenow.getTime(),parseInt(lowtemp),parseInt(hightemp)]);
              }

          });
          this.httpService.getReq3(this.latitude.toString(),this.longtitude.toString()).subscribe(weatherdata=>{
            init(JSON.parse(JSON.stringify(weatherdata)), 'container');
          });
          
          this.showprogressbar=false;
          this.showcountylabel=true;
          this.showresult=true;
          this.showresultparent=true;
        });      
      }else{
        var url="https://maps.googleapis.com/maps/api/geocode/json?address="+this.street.nativeElement.value+",+"+this.city.nativeElement.value+",+"+this.state.nativeElement.value+"&key=AIzaSyD9BnEyrsA8HgeAJcisPy7Qkege1nFpltM"
        this.httpService.getReq0(url).subscribe(data=>{
          var obj=JSON.parse(JSON.stringify(data));
          this.latitude=obj.results[0].geometry.location.lat;
          this.longtitude=obj.results[0].geometry.location.lng;
          this.httpService.getReq1(this.latitude.toString(),this.longtitude.toString()).subscribe(weatherdata=>{
            try { 
              var weatherjson=JSON.parse(JSON.stringify(weatherdata)).data.timelines[0];
            } catch(e) {
              if (e instanceof TypeError) {
                this.showerror=true;
                // alert("An error occured please try again later");
              } 
            }
            for(let i=0;i<weatherjson.intervals.length;i++){
              this.weatherinfolist.push([ weatherjson.intervals[i].values.humidity,
                                          weatherjson.intervals[i].values.windSpeed,
                                          weatherjson.intervals[i].values.visibility,
                                          weatherjson.intervals[i].values.temperatureMin,
                                          weatherjson.intervals[i].values.temperatureMax,
                                          weatherjson.intervals[i].values.weatherCode,
                                          weatherjson.intervals[i].values.sunriseTime,
                                          weatherjson.intervals[i].values.sunsetTime,
                                          weatherjson.intervals[i].values.precipitationProbability,
                                          weatherjson.intervals[i].values.precipitationType,
                                          '',
                                          weatherjson.intervals[i].values.cloudCover,
                                          weatherjson.intervals[i].values.temperature,
                                          weatherjson.intervals[i].values.sunriseTime//sunrise
                                        ]);
            }
            this.streettext= this.street.nativeElement.value;
            this.citytext= this.city.nativeElement.value;
            for(var val of this.statejson){
              if(val[0]==this.state.nativeElement.value){
                this.statetext= val[1];
                break;
              }
            }
            for(let i = 0; i < weatherjson.intervals.length; i++){
              var day = new Date(this.weatherinfolist[i][6].substring(0, 10));
              this.weatherinfolist[i][6]=this.week[day.getDay()]+", "+this.weatherinfolist[i][6].substring(8, 10)+" "+
                          this.month[day.getMonth()]+" "+this.weatherinfolist[i][6].substring(0, 4);
              for(let j=0;j<this.tagweather.length;j++){
                if(this.tagweather[j][0]==this.weatherinfolist[i][5]){
                  this.weatherinfolist[i][10]=this.tagweather[j][1];
                }
              }
              this.weatherinfolist[i][4]=(parseFloat(this.weatherinfolist[i][4])*9/5+32).toFixed(2)
              this.weatherinfolist[i][3]=(parseFloat(this.weatherinfolist[i][3])*9/5+32).toFixed(2)  
              for(let j=0;j<this.codetoimg.length;j++){
                if(this.codetoimg[j][0]==this.weatherinfolist[i][5]){
                  this.weatherinfolist[i][5]=this.codetoimg[j][1];
                }
              }
            }
            this.weatherinfolist.splice(14, 100);
            // highcharts
            for(let i=0;i<this.weatherinfolist.length;i++){
              let timenow=new Date(this.weatherinfolist[i][6]);
              let lowtemp=(+this.weatherinfolist[i][3]*9/5+32).toFixed(2);
              let hightemp=(+this.weatherinfolist[i][4]*9/5+32).toFixed(2);
              this.ranges.push([timenow.getTime(),parseInt(lowtemp),parseInt(hightemp)]);
            }

        });
        this.httpService.getReq3(this.latitude.toString(),this.longtitude.toString()).subscribe(weatherdata=>{
          init(JSON.parse(JSON.stringify(weatherdata)), 'container');
        });
        
        this.showprogressbar=false;
        this.showcountylabel=true;
        this.showresult=true;
        this.showresultparent=true;
        });
      }
    // } catch(e) {
    //   console.log(e)
    //   if (e instanceof TypeError) {
    //     alert("An error occured please try again later");
    //   } 
    // }
   
  }
}