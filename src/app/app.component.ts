import { Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { RxTranslation, translate } from '@rxweb/translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  

  @translate() global: any;
  title = 'frontend-v2';
  constructor(public routes:Router,private rxTranslation: RxTranslation){
    // this.rxTranslation.change("es");
    this.rxTranslation.change(localStorage.getItem("selectedLanguage") as string );
  }

  ngOnInit(): void {
    
  }
}
