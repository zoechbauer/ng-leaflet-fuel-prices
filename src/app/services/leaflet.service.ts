import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { Observable, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeafletService {
  private SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  getLatLngByAddress(address: string): Observable<LatLngLiteral> {
    return this.http
      .get<any[]>(this.SEARCH_URL, {
        params: {
          q: address,
          format: 'json',
        },
      })
      .pipe(
        tap((result) => console.log('getLatLngByAddress result', result)),
        map((data: any[]) => {
          if (data.length > 0) {
            return {
              lat: data[0].lat,
              lng: data[0].lon,
            };
          } else {
            return { lat: 0.0, lng: 0.0 };
          }
        }),
        catchError((err) => {
          throw 'error in source. Details: ' + err;
        })
      );
  }

}
