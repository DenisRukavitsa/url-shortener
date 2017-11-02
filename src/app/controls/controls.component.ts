import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  error = '';
  shortenedUrl = '';
  buttonLoading = false;
  redirecting = false;
  form: FormGroup;
  urlControl: AbstractControl;
  shortCodeControl: AbstractControl;
  private route = '';
  private domain = '';
  private readonly validLetters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                                   'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                                   'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                                   'u', 'v', 'w', 'x', 'y', 'z', '-', '_'];

  // injecting the dependencies
  constructor(private formBuilder: FormBuilder,
              private httpService: HttpService,
              private firebaseService: FirebaseService) {}

  ngOnInit() {
    // getting current route
    const splittedUrl = window.location.href.split('://')[1].split('/');
    this.domain = splittedUrl[0];
    this.route = splittedUrl[1];

    // setting up the HTML inputs
    this.form = this.formBuilder.group({
      'urlControl': [''],
      'shortCodeControl': ['']
    });
    this.urlControl = this.form.controls['urlControl'];
    this.shortCodeControl = this.form.controls['shortCodeControl'];

    // redirecting to URL, if its shortcode is passed as the route
    if (this.route) {
      this.redirecting = true;
      this.firebaseService.getURL(this.route, value => {
        if (value) {
          window.location.replace(value);
        } else {
          this.redirecting = false;
          alert('Oops!.. There is no associated URL to the short code "' + this.route +
                '" you provided. But you can create the association right now.');
        }
      });
    }
  }

  // Generate button click handler
  generate() {
    this.buttonLoading = true;
    const url = this.urlControl.value;
    const shortCode = this.shortCodeControl.value;

    this.checkInputs(url, shortCode);
  }

  private checkInputs(url: string, shortCode: string) {
    // attaching HTTP protocol to the URL if protocol is not provided
    if (!url.toLowerCase().startsWith('http://') && !url.toLowerCase().startsWith('https://')) {
      url = 'http://' + url;
      console.log(url);
    }

    // client-side validations for URL
    if (!url) {
      this.showError(this.urlControl, 'Please provide the URL first');
      return;
    }
    if (!new RegExp(`\\(?(?:(http|https|ftp):\\/\\/)?(?:((?:[^\\W\\s]|\\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\\W\\s]|\\.|-)+[\\.][^\\W\\s]{2,4}|localhost(?=\\/)|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})(?::(\\d*))?([\\/]?[^\\s\\?]*[\\/]{1})*(?:\\/?([^\\s\\n\\?\\[\\]\\{\\}\\#]*(?:(?=\\.)){1}|[^\\s\\n\\?\\[\\]\\{\\}\\.\\#]*)?([\\.]{1}[^\\s\\?\\#]*)?)?(?:\\?{1}([^\\s\\n\\#\\[\\]]*))?([\\#][^\\s\\n]*)?\\)?`)
        .test(url)) {
      this.showError(this.urlControl, 'URL is not correct. Please use the format http://example.com');
      return;
    }

    if (shortCode) {
      let failed = false;
      // client-side validation for short code
      shortCode.split('').forEach(letter => {
        if (!this.validLetters.includes(letter)) {
          failed = true;
          this.buttonLoading = false;
          this.showError(this.shortCodeControl, 'Invalid short code character: ' + letter);
        }
      });
      if (failed) { return; }
    }

    // accessing the server with POST request
    this.httpService.post(url)
      .subscribe((response: {error: string}) => {

        if (response.error === 'no') {
          // server URL validation passed
          if (shortCode) {
            // short code specified by user
            this.saveUrlShortCodePair(url, shortCode,
              'Short code is already in use. Please specify another one');
          } else {
            // short code needs to be generated
            shortCode = this.generateShortUrl();
            this.saveUrlShortCodePair(url, shortCode,
              'Generated short code is already in use. Please generate another one');
          }

        // server URL validation failed
        } else if (response.error.includes('ENOTFOUND')) {
          this.showError(this.urlControl, 'Nothing found using the URL');
        } else {
          this.showError(this.urlControl, 'Error occurred during accessing the URL: ' + response.error);
        }

      // if something went wrong with the Server
      }, error => {
        this.showError(this.urlControl, 'Error occurred during accessing the Server: ' + error.statusText);
      });
  }

  // Checking short code for existence and saving URL and short code to DB
  private saveUrlShortCodePair(url: string, shortCode: string, shortCodeError: string) {
    this.firebaseService.getURL(shortCode, value => {
      if (value) {
        this.showError(this.shortCodeControl, shortCodeError);
      } else {
        this.firebaseService.saveUrlWithShortCode(url, shortCode).then(() => {
          this.showSuccess(shortCode);
        }, () => {
          this.showError(this.urlControl, `Cannot connect to the database. Please try again later.`);
        });
      }
    });
  }

  // showing the error message
  private showError(control: AbstractControl, error: string) {
    control.setErrors({});
    this.shortenedUrl = '';
    this.error = error;
    this.buttonLoading = false;
  }

  // showing the success message
  private showSuccess(shortCode: string) {
    this.urlControl.setErrors(null);
    this.shortCodeControl.setErrors(null);
    this.error = '';
    this.shortenedUrl = this.domain + '/' + shortCode;
    this.buttonLoading = false;
  }

  // generating the random code for the shortened URL
  private generateShortUrl(): string {
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += this.validLetters[Math.floor(Math.random() * this.validLetters.length)];
    }
    this.buttonLoading = false;
    return code;
  }

}
