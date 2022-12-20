import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService{
  invokeEvent: Subject<any> = new Subject();

  get theme(): string {
    return document.documentElement.getAttribute('theme') as string;
  }

  set theme(name: string) {
    document.documentElement.setAttribute('theme', name);
  }
}