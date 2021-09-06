import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerConectionService {

  constructor(private http: HttpClient) {
  }
  server = 'http://192.168.1.101:8080/';

  postLedChanges(led: number) {
    var response: number[];
    response = [led]

    return this.http.post(this.server + '/Api/Leds', response);
  }
  getAllHouse() {
    return this.http.get(this.server + '/Api/House');
  }
  getCamara() {
    return this.http.get(this.server + '/Api/Camera');

  }

}
