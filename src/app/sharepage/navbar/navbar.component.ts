import { Component, EventEmitter, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
// import { DarkModeService} from 'node_modules/angular-dark-mode/angular-dark-mode';
import {DarkModeService} from 'angular-dark-mode';
import {Observable} from 'rxjs';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit {
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;

  showdark: any= false;
  isLight = false;
  htmlStr = 'Light Mode';
  numOfPosts = 0;
  numofDays = 0;
  
  constructor(private themeService: EventEmitterService, private darkModeService: DarkModeService) { }

  ngOnInit(): void {
  }
 
 
  get dark() {
    return this.themeService.theme === 'darkmode';
  }

 
  removeDark(){
    document.getElementsByClassName('navigation')[0]?.classList.remove('lightmode');
  }
  onToggle(): void {
    this.darkModeService.toggle();
    if(this.htmlStr == 'Light Mode'){
      this.htmlStr = 'Dark Mode';
     }else{
      this.htmlStr = 'Light Mode';
    }
  }
}
