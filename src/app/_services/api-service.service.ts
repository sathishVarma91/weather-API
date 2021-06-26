import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getWeatherDataByCityName(cityName: string) {
    return this.httpClient.get(`${environment.apiURL}?q=${cityName}&appid=${environment.apiKey}`);
  }

}
