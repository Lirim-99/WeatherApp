import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { WeatherServiceService } from 'src/app/services/weather-service.service';
import { SharedServiceService } from 'src/app/shared-service.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-weather-page',
  templateUrl: './weather-page.component.html',
  styleUrls: ['./weather-page.component.css']
})
export class WeatherPageComponent implements OnInit {  


  searchForm:any=FormGroup
  public lat:any;
  public lng:any;
  fiveDayForecast: any=[];
  key:any;
  cityName:any;
  citysNames:any=[]
  countryName:any;
  weathertext:any;
  tiranaKey:any;
  tiranaGeoLocation='41.3275%20%2C%2019.8187%20';
  tiranaTemp:any;
  currentTemp:any;
  weatherIcon: any;
  celcius=false;
  forenheit=false;
  errors:any;
  keyFavorite:any;
  currentTempForenheit: any;
  isFirstLaunch=true;
  test: any;
  p=1;
  twelveHours:any=[]

  currenctCityModel: any;
  currentCityName:any=[];
  isFavorite = false;
  favItemsArray : any[] = [];
  // private eventEmitterSubcription: Subscription;

  constructor(private weatherService:WeatherServiceService,
    private fb:FormBuilder, 
    private route: ActivatedRoute, 
    private toastr: ToastrService,
    private router: Router,
    private service: EventEmitterService,
    private sharedService:SharedServiceService,
    private location: Location
  ) {

     
  }
   

  ngOnInit(): void {
    this.searchForm= this.fb.group(
      {
        citySearch:''
      }
    )
    let selectedFavorite =  this.sharedService.redirect;
    if(selectedFavorite && selectedFavorite !== ''){
      let selectedFavorite =  this.sharedService.redirect;
      console.log(selectedFavorite)
      this.searchForm?.controls.citySearch?.setValue(selectedFavorite);
      this.onSubmit();
    }else{
      this.getTirana();
    }
    this.getPosition();
    this.showCelcius();
    this.favItemsArray = JSON.parse(localStorage.getItem('favItems') || '{}');
    if (this.favItemsArray.length === undefined) {
      this.favItemsArray= [];
    }
  }

 
  //

  //function that is called on search
  onSubmit(){
    console.log(this.searchForm.value);
    //api to get the key
    let formData:FormData = new FormData();
    let formValue=this.searchForm.value;
    console.log(formValue);
    if(this.searchForm?.value?.citySearch){
       formData.append(`citySearch`,formValue?.citySearch)
    }
     this.weatherService.getlocation(this.searchForm.value.citySearch).subscribe((res:any)=>{
      console.log(res);
      if(res != null){
        this.currentCityName?.push(res[0]);
        this.key=res[0]?.Key;
        this.cityName=res[0]?.LocalizedName;
        this.citysNames=res;
        console.log(this.citysNames)
        this.countryName=res[0]?.Country?.LocalizedName;
      }
      console.log(this.key,this.cityName,this.countryName, this.weatherIcon)
      //api that uses the key to get 5 days daily forecast
      this.weatherService.fivedaysDailyForecast(this.key).subscribe((response:any)=>{
        console.log(response)
        this.fiveDayForecast=response.DailyForecasts;
        this.fiveDayForecast.forEach((day : any) => {
          //change to forenheit function
          day.forenheitMax = day.Temperature.Maximum.Value * 9.0 / 5.0 + 32;
          day.forenheitMin = day.Temperature.Minimum.Value * 9.0 / 5.0 + 32;
          day.forenheitMax = day.forenheitMax.toPrecision(4);
          day.forenheitMin = day.forenheitMin.toPrecision(4);
        });
      },error=>{
        console.log(error)
        this.errors=error.error;
        console.log(this.errors)
      });
      //api to get the current condition and name of country
      this.weatherService.getcurrentCondition(this.key).subscribe((current:any)=>{

        current[0].cityName = this.cityName
        current[0].countryName = this.countryName
        current[0].LocalizedName = current[0].LocalizedName
        this.currenctCityModel = current[0];
        this.favItemsArray=this.sharedService.locallyArray
        let indexOfFavItem = this.favItemsArray.findIndex(x => x.MobileLink === this.currenctCityModel.MobileLink);
        console.log(indexOfFavItem)
        if (indexOfFavItem != -1){
          this.isFavorite = true
        } else {
          this.isFavorite = false
        }
      
       this.weathertext=current[0].WeatherText;
       this.currentTemp=current[0].Temperature.Metric.Value;
       this.currentTempForenheit=current[0].Temperature.Imperial.Value;
       this.weatherIcon = current[0].WeatherIcon;
      });
      this.weatherService.twelveHoursofHourlyForecasts(this.key).subscribe(twelwe=>{
        console.log(twelwe)
        this.twelveHours=twelwe;
        this.twelveHours.forEach((day : any) => {
          //change to forenheit function
          day.forenheit = day.Temperature.Value * 9.0 / 5.0 + 32;
          day.forenheit = day.forenheit.toPrecision(4);
        });
        console.log(this.twelveHours)
      })
    });
    
    localStorage.setItem('selectedFavorite', '');
  }

  //function to call tirana by default onInit
  getTirana(){
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
        this.lng = resp.coords.longitude;
        this.lat = resp.coords.latitude;
        let currentLongLat = this.lat + ',' + this.lng;
    this.weatherService.defaultLocation(currentLongLat).subscribe((res:any)=>{
      this.tiranaKey=res?.Key;
      this.cityName=res?.LocalizedName;
      this.countryName=res?.Country?.LocalizedName;


    this.weatherService.getcurrentCondition(this.tiranaKey).subscribe((response:any)=>{
      this.weathertext=response[0].WeatherText;
      this.currentTemp=response[0].Temperature.Metric.Value;
      this.currentTempForenheit=response[0].Temperature.Imperial.Value;
      this.weatherIcon = response[0].WeatherIcon

      response[0].cityName = this.cityName
      response[0].countryName = this.countryName
      this.currenctCityModel = response[0];
      this.favItemsArray=this.sharedService.locallyArray
      let indexOfFavItem = this.favItemsArray.findIndex(x => x.MobileLink === this.currenctCityModel.MobileLink);

      if (indexOfFavItem != -1){
        this.isFavorite = true
      }
    });
    this.weatherService.fivedaysDailyForecast(this.tiranaKey).subscribe((getCurrent:any)=>{
      this.fiveDayForecast=getCurrent.DailyForecasts;
      this.fiveDayForecast.forEach((day : any) => {
        day.forenheitMax = day.Temperature.Maximum.Value * 9.0 / 5.0 + 32;
        day.forenheitMin = day.Temperature.Minimum.Value * 9.0 / 5.0 + 32;

        day.forenheitMax = day.forenheitMax.toPrecision(4);
        day.forenheitMin = day.forenheitMin.toPrecision(4);
      });
    })
    this.weatherService.twelveHoursofHourlyForecasts(this.tiranaKey).subscribe(twelveH=>{
      this.twelveHours=twelveH;
      this.twelveHours.forEach((day : any) => {
        //change to forenheit function
        day.forenheit = day.Temperature.Value * 9.0 / 5.0 + 32;
        day.forenheit = day.forenheit.toPrecision(4);
      });
    })
  });
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
    
  }

  //function to add to favorite and save to localstorage
  addToFavourite() {

    this.isFavorite = !this.isFavorite
    this.favItemsArray=this.sharedService.locallyArray
    let indexOfFavItem = this.favItemsArray.findIndex(x => x.MobileLink === this.currenctCityModel.MobileLink);
      // console.log(indexOfFavItem,this.isFavorite)
    if (indexOfFavItem === -1){
      // this.favItemsArray.push(this.currenctCityModel);
      this.sharedService.locallyArray.push(this.currenctCityModel);
      // console.log("servicee",this.sharedService.locallyArray);
      this.toastr.success('Added to Favorites');
      
    } else {
      this.sharedService.locallyArray.splice(indexOfFavItem, 1);
      this.toastr.info('Removed from Favorites');
    }
    //put items in localstorage
    localStorage.setItem('favItems', JSON.stringify(this.favItemsArray));
  }
  showCelcius(){
    this.celcius=true;
    this.forenheit=false;
  }
  showForenheit(){
    this.forenheit=true;
    this.celcius=false;
  }
  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
        console.log(resp);
        this.lng = resp.coords.longitude;
        this.lat = resp.coords.latitude;
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
  }

  onSearch(event: any){
    this.searchForm.controls['citySearch'].setValue(event.term);
  }

  showCities(event:Event){
    console.log(this.searchForm.value.citySearch)
    var cityOptions :any=[]
    // console.log(event)
    // const ngxSelect_input = (document.getElementsByClassName('ng-select-searchable')[0] as HTMLInputElement).value
    // console.log(ngxSelect_input)
    // console.log()


    // if(ngxSelect_input[ngxSelect_input.length-1]){
      this.weatherService.getlocation(this.searchForm.value.citySearch).subscribe((res:any)=>{
      // console.log(res);
      if(res != null){
     
        res.forEach((city:any) => {
        //  this.currentCityName?.push(city);
        //   this.key=city?.Key;
        //   this.cityName=city?.LocalizedName; 
        // console.log(city)
          this.citysNames.push({"name": city?.LocalizedName, "id": city.Key,"country":city.Country.LocalizedName});
          cityOptions.push({"name": city?.LocalizedName, "id": city.Key,"country":city.Country.LocalizedName});
        });
        this.citysNames = cityOptions
      }
    })
      // this.citysNames.push(ngxSelect_input)
    // }
    
    // console.log(this.citysNames)
  }

  selectItem(city:any,name:any){
    // console.log(city,name)
    if(name != null){
      this.currentCityName?.push(name.name);
      this.cityName=name.name;
      // console.log(this.citysNames)
      this.countryName=name.country;
    }
    // console.log(city)
   
    // this.weatherService.getlocation(city).subscribe((res:any)=>{
    //   console.log(res);
    //   if(res != null){
     
    //     res.forEach((city:any) => {
    //       this.currentCityName?.push(city);
    //       this.key=city?.Key;
    //       this.cityName=city?.LocalizedName;
    //       console.log("CITY NAME", this.citysNames)
    //     });
    //     console.log(this.citysNames)
    //     this.countryName=res[0]?.Country?.LocalizedName;
       
    //   }
    // })
    this.weatherService.fivedaysDailyForecast(city).subscribe((response:any)=>{
      console.log(response)
      this.fiveDayForecast=response.DailyForecasts;
      this.fiveDayForecast.forEach((day : any) => {
        //change to forenheit function
        day.forenheitMax = day.Temperature.Maximum.Value * 9.0 / 5.0 + 32;
        day.forenheitMin = day.Temperature.Minimum.Value * 9.0 / 5.0 + 32;
        day.forenheitMax = day.forenheitMax.toPrecision(4);
        day.forenheitMin = day.forenheitMin.toPrecision(4);
      });
    },error=>{
      console.log(error)
      this.errors=error.error;
      console.log(this.errors)
    });
    //api to get the current condition and name of country
    this.weatherService.getcurrentCondition(city).subscribe((current:any)=>{

      current[0].cityName = this.cityName
      current[0].countryName = this.countryName

      current[0].LocalizedName = current[0].LocalizedName
      this.currenctCityModel = current[0];
      this.favItemsArray=this.sharedService.locallyArray
      let indexOfFavItem = this.favItemsArray.findIndex(x => x.MobileLink === this.currenctCityModel.MobileLink);
      // console.log(indexOfFavItem)
      if (indexOfFavItem != -1){
        this.isFavorite = true
      } else {
        this.isFavorite = false
      }
    
     this.weathertext=current[0].WeatherText;
     this.currentTemp=current[0].Temperature.Metric.Value;
     this.currentTempForenheit=current[0].Temperature.Imperial.Value;
     this.weatherIcon = current[0].WeatherIcon;
    });
    this.weatherService.twelveHoursofHourlyForecasts(city).subscribe(twelwe=>{
      // console.log(twelwe)
      this.twelveHours=twelwe;
      this.twelveHours.forEach((day : any) => {
        //change to forenheit function
        day.forenheit = day.Temperature.Value * 9.0 / 5.0 + 32;
        day.forenheit = day.forenheit.toPrecision(4);
      });
      // console.log(this.twelveHours)
    })

    // console.log("selected city", city)
  }
  
}
