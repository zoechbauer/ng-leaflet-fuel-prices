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

  constructor(
    private http: HttpClient,
    private popupTooltipService: PopupTooltipService
  ) {}

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

  initMapOptions(
    options: L.MapOptions,
    zoom: number,
    maxZoom: number
  ): L.MapOptions {
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
  centerMap(
    map: L.Map,
    options: L.MapOptions,
    coord: L.LatLngLiteral,
    zoom: number
  ) {
    options.center = L.latLng(coord.lat, coord.lng);
    options.zoom = zoom;
    if (map) {
      map.setView([coord.lat, coord.lng], zoom);
    }
  }

  setLayerWithMarker(
    isSearchAddress: boolean,
    address: string,
    fuelInfo: IFuelInfo,
    layers: L.Layer[],
    coord: L.LatLngLiteral,
    priceRankingMap: Map<number, number>
  ): L.Layer[] {
    if (isSearchAddress) {
      layers = [];
    }

    const rankingSum = this.getRankingSum(priceRankingMap);
    let marker: L.Marker<any> | L.CircleMarker;

    if (fuelInfo && fuelInfo.price !== 'unbekannt') {
      marker = this.setCircleMarker(coord, fuelInfo.price, priceRankingMap, rankingSum);
    } else {
      marker = this.setMarker(coord, isSearchAddress);
    }

    marker
      .bindTooltip(
        isSearchAddress
          ? this.popupTooltipService.getTooltipTextForSearchAddress(address)
          : this.popupTooltipService.getTooltipText(fuelInfo)
      )
      .bindPopup(
        isSearchAddress
          ? this.popupTooltipService.getPopupTextForSearchAddress(
              coord,
              address
            )
          : this.popupTooltipService.getPopupTextForGasStation(coord, fuelInfo)
      );

    layers.push(marker);

    return layers;
  }

  private setMarker(
    coord: L.LatLngLiteral,
    isSearchAddress: boolean
  ): L.Marker {
    const marker = L.marker([coord.lat, coord.lng], {
      icon: L.icon({
        iconSize: isSearchAddress ? [25 * 1.5, 41 * 1.5] : [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
      opacity: 0.5,
    });
    return marker;
  }

  private setCircleMarker(
    coord: L.LatLngLiteral,
    price: string | undefined,
    priceRankingMap: Map<number, number>,
    rankingSum: number
  ): L.CircleMarker {

    const circleMarker = L.circleMarker([coord.lat, coord.lng], {
      radius: this.calcCircleRadius(price, priceRankingMap, rankingSum),
      opacity: 0.5,
    });
    return circleMarker;
  }

  private calcCircleRadius(
    price: string | undefined,
    priceRankingMap: Map<number, number>,
    rankingSum: number
  ): number {

    const priceVal = price ? +price : 0;
    const ranking = priceRankingMap.get(priceVal);
    const radius = Math.max((ranking ? rankingSum * 3 - ranking * 3 : 0), 20);
    console.log('Circle radius', radius);

    return radius;
    
  }

  private getRankingSum(priceRankingMap: Map<number, number>): number {
    let sum = 0;
    priceRankingMap.forEach((value) => {
      sum += value;
    });
    return sum;
  }
}
