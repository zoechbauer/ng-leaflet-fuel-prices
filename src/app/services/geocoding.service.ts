import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  geocodeAddress(address: string): Observable<any> {
    const params = {
      q: address,
      format: 'jsonv2'
    };
    return this.http.get<any>(this.apiUrl, { params: params });
  }

  convertCoordinate(latLng: number): string {
    let deg: number, min: number, sec: number, result:number, decimals: number;

    deg = Math.floor(latLng);
    decimals = latLng - deg;

    result = decimals * 60;
    min = Math.floor(result);
    decimals = result - min;

    sec = Math.round(decimals * 60);

    return `${deg}° ${min}" ${sec}'`;
  }
}

