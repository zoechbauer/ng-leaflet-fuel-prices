import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { IFuel } from '../model/ifuel';
import { IGasStation } from '../model/igas-station';

@Injectable({
  providedIn: 'root',
})
export class EControlService {
  private apiUrl =
    'https://api.e-control.at/sprit/1.0/search/gas-stations/by-address';

  constructor(private http: HttpClient) {}

  searchGasStations(
    latitude: number,
    longitude: number,
    fuelType: string,
    includeClosed: boolean
  ): Observable<any> {
    const params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      fuelType: fuelType,
      includeClosed: includeClosed.toString(),
    };
    return this.http.get<IGasStation[]>(this.apiUrl, { params: params }).pipe(
      tap((_) => console.log()),
      map((stations: IGasStation[]) =>
        stations.map((gasStation: IGasStation) => ({
          ...gasStation,
          name: gasStation.name.toUpperCase(),
        }))
      )
    );
  }

  fillFuelArr(): IFuel[] {
    return [
      { displayValue: 'Diesel', value: 'DIE' },
      { displayValue: 'Super', value: 'SUP' },
      { displayValue: 'Gas', value: 'GAS' },
    ];
  }
}
