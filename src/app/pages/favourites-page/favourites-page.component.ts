import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { SharedServiceService } from 'src/app/shared-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-favourites-page',
  templateUrl: './favourites-page.component.html',
  styleUrls: ['./favourites-page.component.css']
})
export class FavouritesPageComponent implements OnInit {
 cityName:any;
  constructor(private router:Router,
              private eventEmitter:EventEmitterService,
              private activateRouter:ActivatedRoute,
              private sharedService:SharedServiceService,
              private toastr: ToastrService,
              ) { 
  
  }

  currentCityName:any=[];

  ngOnInit(): void {
    // console.log(this.sharedService.locallyArray);
    //get data from localstorage
   this.currentCityName=this.sharedService.locallyArray;
  }
  redirectTo(cityName:any){
    console.log(this.currentCityName)
    console.log(cityName)
    this.sharedService.redirect = cityName.cityName;
    localStorage.setItem('selectedFavorite', cityName.cityName);
    this.router.navigate(['']);
    // { queryParams: { returnUrl: cityName.cityName } }
  
  }
  //Delete the favorite Location 
  deleteFav(index:any){
    this.currentCityName=this.sharedService.locallyArray;
    this.currentCityName.splice(index,1)
    this.toastr.error('Removed from Favorites');

  }
  
}
