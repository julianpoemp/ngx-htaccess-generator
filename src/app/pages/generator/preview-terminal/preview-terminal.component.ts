import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as clipboard from 'clipboard-polyfill';

@Component({
  selector: 'app-preview-terminal',
  templateUrl: './preview-terminal.component.html',
  styleUrls: ['./preview-terminal.component.css']
})
export class PreviewTerminalComponent implements OnInit {
  @Input() htaccessFile = {
    blobURL: null,
    content: ''
  };

  @ViewChild('pop', {static: true}) clipboardTooltip: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  copyToClipBoard() {
    clipboard.writeText(this.htaccessFile.content);
    this.clipboardTooltip.show();
    setTimeout(() => {
      this.clipboardTooltip.hide();
    }, 1000);
  }

}
