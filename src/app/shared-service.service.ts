import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  locallyArray: any = [];
  redirect:any;
  

  constructor() { }
}
