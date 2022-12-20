import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
 key = 'rtYyOE9ywPr2GSmnrMh6HlWQeaSQcwIO';
 key1= '64M9jL5spHQLBcr9FFFVeWNeaWEuAu9N';
 key2= 'pln8mx04JEbM5gAcxy53HZuprh9rx0sS';
  constructor(private http:HttpClient) {
   
   }
   getlocation(name:any){
    return this.http.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${this.key1}&q=${name}`)
   }
   
   getcurrentCondition(locationKey:any){
    return this.http.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${this.key1}`)
    
   }
  fivedaysDailyForecast(locationKey:any){
    return this.http.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${this.key1}&metric=true`)
  }
  twelveHoursofHourlyForecasts(locationKey:any){
    return this.http.get(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${this.key1}&metric=true`)
  }
  defaultLocation(locationKey:any){
    return this.http.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${this.key1}&q=${locationKey}`)
  }
}  
