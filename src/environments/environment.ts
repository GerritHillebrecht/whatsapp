// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: "AIzaSyCPsNzq1UHzactGELCUdl7siVCBt80daPs",
    authDomain: "whatsapp-angular.firebaseapp.com",
    projectId: "whatsapp-angular",
    storageBucket: "whatsapp-angular.appspot.com",
    messagingSenderId: "386476477447",
    appId: "1:386476477447:web:a37a93e0092cb3e0ea2ea2",
    measurementId: "G-CKC93DPHJV"
  },
  production: false,
  graphql: {
    protocol: {
      http: 'http',
      ws: 'ws',
    },
    uri: 'localhost:3000',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
