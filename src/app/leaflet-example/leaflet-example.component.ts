import { OnInit, AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { LeafletService } from '../services/leaflet.service';
import { AddressType } from '../model/address-type';

@Component({
  selector: 'app-leaflet-example',
  templateUrl: './leaflet-example.component.html',
  styleUrls: ['./leaflet-example.component.scss'],
})
export class LeafletExampleComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  layers: L.Marker<any>[] = [];
  options!: L.MapOptions;
  coord!: L.LatLngLiteral;
  startAdressCoord!: L.LatLngLiteral;
  additionalAdressCoords: L.LatLngLiteral[] = [];
  zoom!: number;
  maxZoom!: number;

  selectedAddressType!: AddressType;
  address!: string;

  constructor(
    private http: HttpClient,
    private leafletService: LeafletService
  ) {}

  ngOnInit() {
    this.selectedAddressType = AddressType.startAddress;
    this.setZoomLevel();
  }

  ngAfterViewInit(): void {
    this.options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: this.maxZoom,
          attribution: '&copy; OpenStreetMap',
        }),
      ],
      zoom: this.zoom,
    };
  }

  searchAddressAndSetMarker(): void {
    this.leafletService.getLatLngByAddress(this.address)
      .subscribe((coord: L.LatLngLiteral) => {
        this.setCoord(coord);
        this.centerMap();
        this.setLayerWithMarker();
      });
  }

  validateStartAddress(): boolean {
    if (this.isStartAddress) {
      return true;
    } else {
      return this.startAdressCoord && !(this.startAdressCoord?.lat === 0 && this.startAdressCoord?.lng === 0);
    }
  }

  private setCoord(coord: L.LatLngLiteral) {
    this.coord = coord;

    if (this.isStartAddress) {
      this.startAdressCoord = coord;
      this.additionalAdressCoords = [];
    } else {
      this.additionalAdressCoords.push(coord);
    }
  }

  private centerMap() {
    const coord: L.LatLngLiteral = this.startAdressCoord;

    this.options.center = L.latLng(coord.lat, coord.lng);
    this.options.zoom = this.zoom;
    if (this.map) {
      this.map.setView([coord.lat, coord.lng], this.zoom);
    }
  }

  private setLayerWithMarker() {
    if (this.isStartAddress) {
      this.layers = [];
    }

    const marker: L.Marker = L.marker([this.coord.lat, this.coord.lng], {
      icon: L.icon({
        iconSize: this.isStartAddress ? [25*1.3, 41*1.3] : [25, 41] ,
        iconAnchor: [13, 41],
        iconUrl: this.isStartAddress ? 'assets/marker-icon-2x.png' : 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      }),
      opacity: 0.5
    })
    .bindTooltip(this.getTooltipText())
    .bindPopup(this.getPopupText());

    this.layers.push(marker);
  }

  private get isStartAddress(): boolean {
    return this.selectedAddressType === AddressType.startAddress;
  }

  private getTooltipText(): string {
    const styleBold = 'style="font-weight: bold;"';

    let styleColor = 'style="color: black;"';
    if (this.isStartAddress) {
      styleColor = 'style="color: red;"'
    }
    return `<div ${styleBold}>${this.address}</div><div ${styleColor}>${this.selectedAddressType.toString()}</div>`;
  }

  private getPopupText(): string {
    const table =
    `<table>
      <tr>
        <th colspan="2">Detailinformationen</th>
      </tr>
      <tr>
        <td>Typ</td>
        <td>${this.selectedAddressType}</td>
      </tr>
      <tr>
        <td>Adresse</td>
        <td>${this.address}</td>
      </tr>
      <tr>
        <td>Breitengrad</td>
        <td>${this.coord.lat}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${this.coord.lng}</td>
      </tr>
    </table>`

    return table;
  }

  private setZoomLevel() {
    this.maxZoom = 18;
    this.zoom = 12;
  }

  onMapReady(map: L.Map): void {
    console.log('onMapReady ', map);
    this.map = map;
  }
}
