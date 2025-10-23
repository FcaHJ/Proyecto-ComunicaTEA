import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, heart, heartOutline, homeOutline, settingsOutline, volumeMediumOutline } from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Storage } from '@ionic/storage-angular';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    Storage
  ],
});

addIcons({
  'settings-outline': settingsOutline,
  'home-outline': homeOutline,
  'heart-outline' : heartOutline,
  'heart': heart,
  'volume': volumeMediumOutline,
  'close': closeOutline
});
