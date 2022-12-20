import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavouritesPageComponent } from './pages/favourites-page/favourites-page.component';
import { WeatherPageComponent } from './pages/weather-page/weather-page.component';

const routes: Routes = [
  {path:'', component:WeatherPageComponent},
  {path:'favourites', component:FavouritesPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
