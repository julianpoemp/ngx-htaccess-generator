## 1.2.4 (2022-07-16)
### Bugfixes
* fixed editor not updating when action triggered

## 1.2.3 (2022-07-16)
### Bugfixes
* fixed issue with invisible code in editor

## 1.2.2 (2022-07-15)
### Enhancements
* added option to redirect to www

### Others
* updated Angular and other dependencies

## 1.2.1 (2022-06-09)
### Enhancements
* updated Angular to 14.0.1
* updated bootstrap to 5.1.3

### Translations
* added translation for Brasilian Portuguese (pt-br) thanks to [regivaldo](https://github.com/regivaldo)


## 1.2.0 (2021-09-16)
### Features
* added mapping of resources to recommended mime types

### Others
* moved security related options to their own section

## 1.1.0 (2021-08-14)
### Design
* generator is now a split screen. Each side can scroll independently.
* textarea was replaced with an syntax-highlighting editor (codeJar)

## 1.0.8 (2021-08-11)
### Generator
* generator: removed redundant redirection with -s. Thanks to stack overflow user Klaassiek. See [post](https://stackoverflow.com/questions/68255822/htaccess-mod-rewrite-difference-between-the-s-and-f-conditions/68744277). 

### Design
* moved alert about server to a own question at the beginning
* moved alter about renaming the htaccess file under the download button. Appears after click on download.

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
