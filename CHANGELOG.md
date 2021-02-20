## 1.0.6 (2021-02-20)
* improved generation of htaccess file
* added Allow-Origins-Header rule with support of multiple origins
* added Rule to remove X-Powered-By header
* added Rule to remove server signature
* design improvements: description for each rule is hidden by default. Click on question mark to show it.


## 1.0.3 (2020-05-22)
* fixed issue with HTTPS redirection. It ignored the paths and redirected just to the index.html.

## 1.0.2 (2020-05-22)
* Browser caching fix is now applied only on files without a hash string to improve loading performance of apps

## 1.0.1 (2020-04-07)

* fixed htaccess not working on reload bug [#1](https://github.com/julianpoemp/ngx-htaccess-generator/issues/1)

## 1.0.0 (2020-04-05)

* added question about base-href attribute
* added question about HTTP to HTTPS Redirection
* added question about excluded directories
* added question about disabling browser cache
