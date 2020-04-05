export class HtaccessGenerator {
  private content = `# Generated with ngx-htaccess-generator 1.0.0
# https://julianpoemp.github.io/ngx-htaccess-generator/

<IfModule mod_rewrite.c>`;

  constructor(private questions: any) {
  }

  public generate(): string {
    if (this.questions.httpsRedirection.checked) {
      this.addHttpsRedirection();
    }

    if (this.questions.exclusions.checked && this.questions.exclusions.list.length > 0) {
      this.addExclusions();
    }

    this.addDefaults();
    this.closeIfModule();

    if (this.questions.browserCachingDisabled.checked) {
      this.addBrowserCacheFix();
    }
    return this.content;
  }

  private addHttpsRedirection() {
    this.content += `
  RewriteCond %{HTTPS} !on
  RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}
  `;
  }

  private addExclusions() {
    this.content += '\n';
    for (const exclusion of this.questions.exclusions.list) {
      this.content += `  RewriteRule ^${exclusion}?(.*) %{REQUEST_URI} [L,R=301]\n`;
    }
  }

  private addDefaults() {
    this.content += `
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
  RewriteRule ^.*$ - [NC,L]
  RewriteRule ^(.*) index.html [NC,L]`;
  }

  private addBrowserCacheFix() {
    this.content += `

# Disable browser caching in production. You can add/remove file extension as you wish.
<FilesMatch "\\.(html|htm|js|json|css)$">
  <IfModule mod_headers.c>
    FileETag None
    Header unset ETag
    Header unset Pragma
    Header unset Cache-Control
    Header unset Last-Modified
    Header set Pragma "no-cache"
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Expires "Mon, 10 Apr 1972 00:00:00 GMT"
  </IfModule>
</FilesMatch>`;
  }

  private closeIfModule() {
    this.content += `
</IfModule>`;
  }
}
