import {
  getBrowserCachingFix,
  getHtaccessDefaults,
  getHtaccessHeader,
  getRedirection,
  getRemoveServerSignature,
  getTransparencyNotice
} from '../htaccess.sections';

export class HtaccessGenerator {

  private content: HTAccessJSON = {
    ifModule: {
      mod_headers: [],
      mod_rewrite: [],
      mod_mime: []
    },
    filesMatch: {
      comment: '',
      regex: ''
    }
  };

  constructor(private questions: any, private version: string) {
  }

  public generate(): string {
    // add default redirection to index.html
    let ascInserted = false;
    this.content.ifModule.mod_rewrite.push(
      'RewriteEngine On'
    );

    this.setRedirection({
      httpsRedirection: this.questions.redirection.options.find(a => a.name === 'httpsRedirection')?.enabled ?? false,
      www: this.questions.redirection.options.find(a => a.name === 'www')?.enabled ?? false
    });

    if (this.questions.exclusions.checked && this.questions.exclusions.list.length > 0) {
      this.addExclusions();
    }

    this.addDefaults();

    if (this.questions.allowOrigins.checked) {
      this.addAllowOrigins();
    }

    if (this.questions.browserCachingDisabled.checked) {
      this.addBrowserCacheFix();
    }

    if (this.questions.securityOptions.checked) {
      this.addSecurityOptions();
    }

    if (this.questions.mimeTypes.checked) {
      ascInserted = true;
      this.addMimeOptions();
    }

    if (this.questions.removeServerSignature.checked) {
      this.addRemoveSignature();
    }

    let result = getHtaccessHeader(this.version);

    if (ascInserted) {
      result += getTransparencyNotice();
      result += '\n\n';
    } else {
      result += '\n';
    }

    result += this.convertHtaccessJSONToString(this.content);

    return result;
  }

  private convertHtaccessJSONToString(htaccess: HTAccessJSON, numberOfSpaces = 0) {
    let result = ``;
    const spaces = ' '.repeat(numberOfSpaces);
    if (htaccess.ifModule) {
      for (const attr in htaccess.ifModule) {
        if (htaccess.ifModule.hasOwnProperty(attr)
          && htaccess.ifModule[attr] !== undefined
          && htaccess.ifModule[attr].length > 0) {
          const modSection = htaccess.ifModule[attr];

          result += `${spaces}<IfModule ${attr}.c>\n`;
          result += this.stringifySections(modSection, spaces);
          result += `\n${spaces}</IfModule>\n\n`;
        }
      }
    }

    if (htaccess.filesMatch) {
      // filesMatch
      if (htaccess.filesMatch.content) {
        result += `${spaces}${htaccess.filesMatch.comment}\n`;
        result += `${spaces}<FilesMatch "^(?!.*\\.([0-9a-z]{20})\\.).*$">\n`;
        result += this.convertHtaccessJSONToString(htaccess.filesMatch.content, numberOfSpaces + 2);
        result += `</FilesMatch>\n`;
      }
    }

    if (htaccess.withoutModule) {
      for (const htElement of htaccess.withoutModule) {
        result += `${spaces}${htElement}\n`;
      }
    }

    return result;
  }

  private stringifySections(sections, spaces) {
    return sections.map((section) => {
      const lines = section.split('\n');
      return (lines.map(a => `${spaces}  ${a}`).join('\n'));
    }).join('\n');
  }

  private setRedirection(options: {
    httpsRedirection: boolean;
    www: boolean;
  }) {
    this.content.ifModule.mod_rewrite.push(getRedirection(options));
  }

  private addExclusions() {
    this.content.ifModule.mod_rewrite.push(
      '# Excluded directories:'
    );
    for (const exclusion of this.questions.exclusions.list) {
      this.content.ifModule.mod_rewrite.push(`RewriteRule ^${exclusion}?(.*) %{REQUEST_URI} [L,R=301]`);
    }
    this.content.ifModule.mod_rewrite.push('');
  }

  private addDefaults() {
    this.content.ifModule.mod_rewrite.push(getHtaccessDefaults());
  }

  private addRemoveSignature() {
    if (!this.content.withoutModule) {
      this.content.withoutModule = [];
    }

    this.content.withoutModule.push(getRemoveServerSignature());
  }

  private addBrowserCacheFix() {
    this.content.filesMatch.regex = '^(?!.*\\.([0-9a-z]{20})\\.).*$';
    this.content.filesMatch.comment = '# Disable browser caching for all files that don\'t get a hash string by Angular.';
    this.content.filesMatch.content = {
      ...this.content.filesMatch.content,
      ifModule: {
        mod_headers: [
          getBrowserCachingFix()
        ]
      }
    };
  }

  private addAllowOrigins() {
    const domains = this.questions.allowOrigins.list.join('|');
    this.content.ifModule.mod_headers.push(
      '# Set allow Access-Control-Allow-Origin header'
    );

    if (this.questions.allowOrigins.list.length > 0 && this.questions.allowOrigins.list[0] !== '*') {
      this.content.ifModule.mod_headers.push(
        '',
        `SetEnvIf Origin "http(s)?://(www\\\\.)?(${domains})$" AccessControlAllowOrigin=$0`,
        'Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin',
        'Header merge Vary Origin'
      );
    } else {
      this.content.ifModule.mod_headers.push(
        `Header set Access-Control-Allow-Origin "${this.questions.allowOrigins.list.join(',')}"`
      );
    }
  }

  private addSecurityOptions() {
    const somethingEnabled = this.questions.securityOptions.options.findIndex(a => a.enabled) > -1;

    if (somethingEnabled) {
      this.content.ifModule.mod_headers.push(
        ''
      );

      for (const option of this.questions.securityOptions.options) {
        if (option.enabled) {
          if (option.value.ifModule) {
            if (option.value.ifModule.mod_headers) {
              this.content.ifModule.mod_headers = this.content.ifModule.mod_headers.concat(option.value.ifModule.mod_headers);
            }
            if (option.value.ifModule.mod_rewrite) {
              this.content.ifModule.mod_rewrite = this.content.ifModule.mod_rewrite.concat(option.value.ifModule.mod_rewrite);
            }
          } else if (option.value.withoutModule) {
            this.content.withoutModule = option.value.withoutModule;
          }
        }

      }
    }
  }

  private addMimeOptions() {
    const somethingEnabled = this.questions.mimeTypes.options.findIndex(a => a.enabled) > -1;

    if (somethingEnabled) {
      this.content.ifModule.mod_mime.push(
        ''
      );

      for (const option of this.questions.mimeTypes.options) {
        if (option.enabled) {
          if (option.value.ifModule.mod_mime) {
            this.content.ifModule.mod_mime = this.content.ifModule.mod_mime.concat(option.value.ifModule.mod_mime);
          }
        }
      }
    }
  }
}

export interface HTAccessJSON {
  ifModule?: {
    mod_rewrite?: string[];
    mod_headers?: string[];
    mod_mime?: string[];
  };
  filesMatch?: {
    comment: string;
    regex: string;
    content?: HTAccessJSON;
  };
  withoutModule?: string[];
}

export interface SecurityOption {
  name: string;
  showDescription: boolean;
  enabled: boolean;
  value: HTAccessJSON;
}

