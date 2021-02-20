import {Component, OnInit, ViewChild} from '@angular/core';
import {AppInfo} from '../../app.info';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit {
  htaccessFile = {
    blobURL: null,
    content: ''
  };

  @ViewChild('pop', {static: true}) clipboardTooltip: any;

  public get version(): string {
    return AppInfo.version;
  }

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
  }


}
