# UrlShortener

This project is generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.2.

Application has a field where user can put valid url.
Application then generates short url.
User also can enter desired short url in another field.
Application validates if requested short url is not in use yet.
Application stores original and short url pair in Firebase DB. User can share short url with other users and once they try to access short url they are redirected to the original url.

## Hosting

App is hosted here https://url-shortener-10d44.firebaseapp.com/

Backend is deployed here https://vast-dusk-65890.herokuapp.com/

## Code

Frontend source code is in the .src folder

Backend code is in the .server folder

## Dependencies

Run `npm install` to download the requred dependencies

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
