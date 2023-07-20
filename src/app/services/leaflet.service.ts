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

    const maxRanking = this.getMaxRank(priceRankingMap);
    let marker: L.Marker<any> | L.CircleMarker;

    if (fuelInfo && fuelInfo.price !== 'unbekannt') {
      marker = this.setCircleMarker(
        coord,
        fuelInfo.price,
        priceRankingMap,
        maxRanking
      );
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
    const factorSearchAddr = 1.5;
    const pointX = 25;
    const pointY = 41;
    const marker = L.marker([coord.lat, coord.lng], {
      icon: L.icon({
        iconSize: isSearchAddress ? [pointX * factorSearchAddr, pointY * factorSearchAddr] : [pointX, pointY],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
      opacity: 0.4
      ,
    });
    return marker;
  }

  private setCircleMarker(
    coord: L.LatLngLiteral,
    price: string | undefined,
    priceRankingMap: Map<number, number>,
    maxRanking: number
  ): L.CircleMarker {
    const circleMarker = L.circleMarker([coord.lat, coord.lng], {
      radius: this.calcCircleRadius(price, priceRankingMap, maxRanking),
      opacity: 0.8
      ,
    });
    return circleMarker;
  }

  private calcCircleRadius(
    price: string | undefined,
    priceRankingMap: Map<number, number>,
    maxRanking: number
  ): number {
    const minRadius = 15;
    const maxRadius = 30;
    const radiusRange = maxRadius - minRadius;

    const priceVal = +price!;
    const ranking = priceRankingMap.get(priceVal);

    let normalizedValue = 1;
    if (maxRanking > 1) {
      normalizedValue = (maxRanking - ranking!) / (maxRanking - 1);
    }

    const radius = minRadius + normalizedValue * radiusRange;
    return radius;
  }

  private getMaxRank(priceRankingMap: Map<number, number>): number {
    let maxRank = 1;

    priceRankingMap.forEach((value) => {
      if (value > maxRank) {
        maxRank = value;
      }
    });
    return maxRank;
  }
}
