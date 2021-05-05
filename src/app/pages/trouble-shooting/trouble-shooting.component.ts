import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-trouble-shooting',
  templateUrl: './trouble-shooting.component.html',
  styleUrls: ['./trouble-shooting.component.css']
})
export class TroubleShootingComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

}
