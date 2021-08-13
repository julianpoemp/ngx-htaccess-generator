export class HtaccessGenerator {
  private content: HTAccessJSON = {
    ifModule: {
      mod_headers: [],
      mod_rewrite: []
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
    this.content.ifModule.mod_rewrite.push(
      'RewriteEngine On',
      ''
    );

    if (this.questions.httpsRedirection.checked) {
      this.addHttpsRedirection();
    }

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

    if (this.questions.headerOptions.checked) {
      this.addHeaderOptions();
    }

    if (this.questions.removeServerSignature.checked) {
      this.addRemoveSignature();
    }

    let result = `# Generated with ngx-htaccess-generator v${this.version}
# https://julianpoemp.github.io/ngx-htaccess-generator/\n\n`;
    result += this.convertHtaccessJSONToString(this.content);

    return result;
  }

  private convertHtaccessJSONToString(htaccess: HTAccessJSON, numberOfSpaces = 0) {
    let result = ``;
    const spaces = ' '.repeat(numberOfSpaces);
    if (htaccess.ifModule) {
      if (htaccess.ifModule.mod_rewrite) {
        // ifModule mod_rewrite
        result += `\n${spaces}<IfModule mod_rewrite.c>\n`;

        for (const line of htaccess.ifModule.mod_rewrite) {
          result += `${spaces}  ${line}\n`;
        }

        result += `${spaces}</IfModule>\n`;
      }

      if (htaccess.ifModule.mod_headers) {
        // ifModule mod_headers
        if (htaccess.ifModule.mod_headers && htaccess.ifModule.mod_headers.length) {
          result += `\n${spaces}<IfModule mod_headers.c>\n`;

          for (const line of htaccess.ifModule.mod_headers) {
            result += `${spaces}  ${line}\n`;
          }

          result += `${spaces}</IfModule>\n`;
        }
      }
    }

    if (htaccess.filesMatch) {
      // filesMatch
      if (htaccess.filesMatch.content) {
        result += `\n${spaces}${htaccess.filesMatch.comment}\n`;
        result += `${spaces}<FilesMatch "^(?!.*\\.([0-9a-z]{20})\\.).*$">\n`;
        result += this.convertHtaccessJSONToString(htaccess.filesMatch.content, numberOfSpaces + 2);
        result += `\n</FilesMatch>\n`;
      }
    }

    if (htaccess.withoutModule) {
      for (const htElement of htaccess.withoutModule) {
        result += `${spaces}${htElement}\n`;
      }
    }

    return result;
  }

  private addHttpsRedirection() {
    this.content.ifModule.mod_rewrite.push(
      '# Redirection to HTTPS:',
      'RewriteCond %{HTTPS} !on',
      'RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]',
      ''
    );
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
    this.content.ifModule.mod_rewrite.push(
      '# Redirection of requests to index.html',
      'RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]',
      'RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d',
      'RewriteRule ^.*$ - [NC,L]',
      '# Redirect all non-file routes to index.html',
      'RewriteRule ^(?!.*\\.).*$ index.html [NC,L]',
    );
  }

  private addRemoveSignature() {
    if (!this.content.withoutModule) {
      this.content.withoutModule = [];
    }

    this.content.withoutModule.push(
      '',
      '# Remove server signature',
      'ServerSignature Off'
    );
  }

  private addBrowserCacheFix() {
    this.content.filesMatch.regex = '^(?!.*\\.([0-9a-z]{20})\\.).*$';
    this.content.filesMatch.comment = '# Disable browser caching for all files that don\'t get a hash string by Angular.';
    this.content.filesMatch.content = {
      ifModule: {
        mod_headers: [
          'FileETag None',
          'Header unset ETag',
          'Header unset Pragma',
          'Header unset Cache-Control',
          'Header unset Last-Modified',
          'Header set Pragma "no-cache"',
          'Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"',
          'Header set Expires "Mon, 10 Apr 1972 00:00:00 GMT"'
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

  private addHeaderOptions() {
    const somethingEnabled = this.questions.headerOptions.options.findIndex(a => a.enabled) > -1;

    if (somethingEnabled) {
      this.content.ifModule.mod_headers.push(
        ''
      );

      for (const option of this.questions.headerOptions.options) {
        if (option.enabled) {
          if (option.value.ifModule.mod_headers) {
            this.content.ifModule.mod_headers = this.content.ifModule.mod_headers.concat(option.value.ifModule.mod_headers);
          }
          if (option.value.ifModule.mod_rewrite) {
            this.content.ifModule.mod_rewrite = this.content.ifModule.mod_rewrite.concat(option.value.ifModule.mod_rewrite);
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

