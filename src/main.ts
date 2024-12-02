import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import * as $ from 'jquery';

declare const window: any;
window['$'] = $;
window['jQuery'] = $;

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    const ajax = new XMLHttpRequest();
    const svgSpriteUrl = '/assets/icons/icons.svg';
    ajax.open('GET', svgSpriteUrl, true);
    ajax.send();
    ajax.onload = function (e) {
      const div = document.createElement('div');
      div.className = 'u-hidden-visually';
      div.innerHTML = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
  });
