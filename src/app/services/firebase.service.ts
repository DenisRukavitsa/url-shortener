import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirebaseService {
  // Base path
  private readonly path = 'urls/';

  constructor (private angularFireDB: AngularFireDatabase) {}

  // getting URL by short code
  getURL(shortCode: string, callback: (url: string) => void) {
    this.angularFireDB.database.ref(this.path + shortCode)
      .once('value').then(snapshot => {
        callback(snapshot.val());
    });
  }

  // setting URL and short code pair
  saveUrlWithShortCode(url: string, shortCode: string): Promise<any> {
    return this.angularFireDB.database.ref(this.path + shortCode).set(url);
  }
}
