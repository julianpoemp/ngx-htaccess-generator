import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-further-information',
  templateUrl: './further-information.component.html',
  styleUrls: ['./further-information.component.css']
})
export class FurtherInformationComponent implements OnInit {

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
  }

}
