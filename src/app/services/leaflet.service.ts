import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import * as L from 'leaflet';
import { IFuelInfo } from '../model/ifuel-info';
import { PopupTooltipService } from './popup-tooltip.service';

@Injectable({
  providedIn: 'root',
})
export class LeafletService {
  private SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient, private popupTooltipService: PopupTooltipService) {}

  getLatLngByAddress(address: string): Observable<L.LatLngLiteral> {
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

  initMapOptions(options: L.MapOptions, zoom: number, maxZoom: number): L.MapOptions {
    options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: maxZoom,
          attribution: '&copy; OpenStreetMap',
        }),
      ],
      zoom: zoom,
    };
    return options;
  }
  centerMap(map: L.Map, options: L.MapOptions, coord: L.LatLngLiteral, zoom: number) {
    options.center = L.latLng(coord.lat, coord.lng);
    options.zoom = zoom;
    if (map) {
      map.setView([coord.lat, coord.lng], zoom);
    }
  }

  setLayerWithMarker(isSearchAddress: boolean,
                    address: string,
                    fuelInfo: IFuelInfo,
                    layers: L.Marker<any>[],
                    coord: L.LatLngLiteral): L.Marker<any>[] {
    if (isSearchAddress) {
      layers = [];
    }

    const marker: L.Marker = L.marker([coord.lat, coord.lng], {
      icon: L.icon({
        iconSize: isSearchAddress ? [25 * 0.5, 41 * 0.5] : [25, 41],
        iconAnchor: [13, 41],
        iconUrl: isSearchAddress
          ? 'assets/marker-icon.png'
          : 'assets/marker-icon.png', // TODO use other icon for SearchAddress
        shadowUrl: 'assets/marker-shadow.png',
      }),
      opacity: 0.5,
    })
      .bindTooltip(
        isSearchAddress
        ? this.popupTooltipService.getTooltipTextForSearchAddress(address)
        : this.popupTooltipService.getTooltipText(fuelInfo))
      .bindPopup(
        isSearchAddress
          ? this.popupTooltipService.getPopupTextForSearchAddress(coord, fuelInfo)
          : this.popupTooltipService.getPopupTextForGasStation(coord, fuelInfo)
      );

    layers.push(marker);
    return layers;
  }

}
