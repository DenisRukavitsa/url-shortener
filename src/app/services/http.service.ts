import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  private readonly SERVER_URL = 'https://vast-dusk-65890.herokuapp.com/';

  constructor(private http: HttpClient) { }

  // accessing the server with POST request
  post(data: any): Observable<Object> {
    return this.http.post(this.SERVER_URL, data);
  }
}
