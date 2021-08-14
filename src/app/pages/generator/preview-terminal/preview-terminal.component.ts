import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as clipboard from 'clipboard-polyfill';
import {AppService} from '../../../app.service';
import hljs from 'highlight.js';
import {CodeJarContainer, NgxCodeJarComponent} from 'ngx-codejar';

@Component({
  selector: 'app-preview-terminal',
  templateUrl: './preview-terminal.component.html',
  styleUrls: ['./preview-terminal.component.css']
})
export class PreviewTerminalComponent implements OnInit {
  @Input() set htaccessFile(value: {
    blobURL: string,
    content: string
  }) {
    console.log(`SET value`);
    console.log(value);
    this._htaccessFile = value;
  }

  public downloadClicked = false;
  public _htaccessFile =  {
    blobURL: null,
    content: ''
  };
  @ViewChild('pop', {static: true}) clipboardTooltip: any;

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
  }

  copyToClipBoard() {
    clipboard.writeText(this._htaccessFile.content);
    this.clipboardTooltip.show();
    setTimeout(() => {
      this.clipboardTooltip.hide();
    }, 1000);
  }

  highlightMethod(editor: CodeJarContainer) {
    if (editor.textContent !== null && editor.textContent !== undefined) {
      editor.innerHTML = hljs.highlight(editor.textContent, {
        language: 'Apache'
      }).value;
    }
  }
}
