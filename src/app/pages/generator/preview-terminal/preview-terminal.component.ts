import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../../app.service';
import hljs from 'highlight.js';
import {CodeJarContainer} from 'ngx-codejar';
import {TooltipDirective} from "ngx-bootstrap/tooltip";
import {writeText} from "clipboard-polyfill";

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
    this._htaccessFile = value;
  }

  public downloadClicked = false;
  public _htaccessFile = {
    blobURL: null,
    content: ''
  };

  @ViewChild('pop', {static: true}) clipboardTooltip: TooltipDirective;

  constructor(public appService: AppService) {
  }

  ngOnInit(): void {
  }

  copyToClipBoard() {
    writeText(this._htaccessFile.content);
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
