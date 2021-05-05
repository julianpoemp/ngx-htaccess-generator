import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-helpful-resources',
  templateUrl: './helpful-resources.component.html',
  styleUrls: ['./helpful-resources.component.css']
})
export class HelpfulResourcesComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

}
