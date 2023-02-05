export function getHtaccessHeader(version: string) {
  return `# Generated with ngx-htaccess-generator v${version}
# Check for updates: https://julianpoemp.github.io/ngx-htaccess-generator/
`;
}

export function getTransparencyNotice() {
  return `#
# Transparency notice: Some parts were extracted from
# Apache Server Configs v5.0.0 | MIT License
# https://github.com/h5bp/server-configs-apache
# Extracted parts are wrapped by "START Extract from ASC"`
}

export function getHtaccessDefaults() {
  return `# Redirection of requests to index.html
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^.*$ - [NC,L]
# Redirect all non-file routes to index.html
RewriteRule ^(?!.*\\.).*$ index.html [NC,L]`;
}

export function getRedirection(options: {
  httpsRedirection: boolean;
  www: boolean;
}) {
  let header = options.httpsRedirection ? 'HTTPS' : '';
  header += options.httpsRedirection && options.www ? ' & ' : '';
  header += options.www ? 'www' : '';

  let condition = '';
  let value = '';

  if (options.www) {
    const http = options.httpsRedirection ? 'https' : 'http';
    condition = 'RewriteCond %{HTTP_HOST} !^www\\. [NC]';
    value = `RewriteRule ^(.*)$ ${http}://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;
  } else if (options.httpsRedirection) {
    condition = 'RewriteCond %{HTTPS} !on';
    value = 'RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]';
  } else {
    return '';
  }

  return `
# Redirection to ${header}:
${condition}
${value}
`;
}

export function getBrowserCachingFix() {
  return `FileETag None
Header unset ETag
Header unset Pragma
Header unset Cache-Control
Header unset Last-Modified
Header set Pragma "no-cache"
Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
Header set Expires "Mon, 1 Jan 1900 00:00:00 GMT"`;
}

export function getMimeTypesMappings() {
  return `### START Extract from ASC
# Serve resources with the proper media types (f.k.a. MIME types).

# Data interchange

AddType application/atom+xml                        atom
AddType application/json                            json map topojson
AddType application/ld+json                         jsonld
AddType application/rss+xml                         rss
AddType application/geo+json                        geojson
AddType application/rdf+xml                         rdf
AddType application/xml                             xml

# JavaScript

# Servers should use text/javascript for JavaScript resources.
# https://html.spec.whatwg.org/multipage/scripting.html#scriptingLanguages

AddType text/javascript                             js mjs


# Manifest files

AddType application/manifest+json                   webmanifest
AddType application/x-web-app-manifest+json         webapp
AddType text/cache-manifest                         appcache


# Media files

AddType audio/mp4                                   f4a f4b m4a
AddType audio/ogg                                   oga ogg opus
AddType image/avif                                  avif
AddType image/avif-sequence                         avifs
AddType image/bmp                                   bmp
AddType image/jxl                                   jxl
AddType image/svg+xml                               svg svgz
AddType image/webp                                  webp
AddType video/mp4                                   f4v f4p m4v mp4
AddType video/ogg                                   ogv
AddType video/webm                                  webm
AddType video/x-flv                                 flv

# Serving \`.ico\` image files with a different media type prevents
# Internet Explorer from displaying them as images:
# https://github.com/h5bp/html5-boilerplate/commit/37b5fec090d00f38de64b591bcddcb205aadf8ee

AddType image/x-icon                                cur ico


# WebAssembly

AddType application/wasm                            wasm


# Web fonts

AddType font/woff                                   woff
AddType font/woff2                                  woff2
AddType application/vnd.ms-fontobject               eot
AddType font/ttf                                    ttf
AddType font/collection                             ttc
AddType font/otf                                    otf


# Other

AddType application/octet-stream                    safariextz
AddType application/x-bb-appworld                   bbaw
AddType application/x-chrome-extension              crx
AddType application/x-opera-extension               oex
AddType application/x-xpinstall                     xpi
AddType text/calendar                               ics
AddType text/markdown                               markdown md
AddType text/vcard                                  vcard vcf
AddType text/vnd.rim.location.xloc                  xloc
AddType text/vtt                                    vtt
AddType text/x-component                            htc

### END Extract from ASC`;
}

export function getRemoveServerSignature() {
  return `
# Remove server signature
ServerSignature Off`;
}

export function getRemovePoweredBy() {
  return `# Remove X-Powerered-By header
Header unset X-Powered-By
Header always unset X-Powered-By`;
}
