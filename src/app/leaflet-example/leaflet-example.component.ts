import { Component, OnInit } from '@angular/core';
import {
  marker,
  icon,
  latLng,
  Map,
  MapOptions,
  tileLayer,
  Marker,
  LatLngLiteral,
} from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { LeafletService } from '../services/leaflet.service';

enum AddressType  {
  startAddress = "startAddress",
  additionalAddress = "additionalAddress"
}

@Component({
  selector: 'app-leaflet-example',
  templateUrl: './leaflet-example.component.html',
  styleUrls: ['./leaflet-example.component.scss'],
})
export class LeafletExampleComponent implements OnInit {
  zoom!: number;
  maxZoom!: number;
  private map!: Map;
  coord!: LatLngLiteral;
  selectedAddressType: AddressType = AddressType.startAddress;
  startAdressCoord!: LatLngLiteral;
  additionalAdressCoords: LatLngLiteral[] = [];
  address!: string;
  layers: Marker<any>[] = [];
  options!: MapOptions;

  constructor(
    private http: HttpClient,
    private leafletService: LeafletService
  ) {}

  ngOnInit(): void {
    this.setZoomLevel();

    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: this.maxZoom,
          attribution: '&copy; OpenStreetMap',
        }),
      ],
      zoom: this.zoom,
    };
  }

  searchAddressAndSetMarker(): void {
    this.leafletService.getLatLngByAddress(this.address)
      .subscribe((coord: LatLngLiteral) => {
        this.setCoord(coord);
        this.centerMap();
        this.setLayer();
      });
  }

  validateStartAddress(): boolean {
    if (this.selectedAddressType === AddressType.startAddress) {
      return true;
    } else {
      return this.startAdressCoord && !(this.startAdressCoord?.lat === 0 && this.startAdressCoord?.lng === 0);
    }
  }

  private setCoord(coord: LatLngLiteral) {
    this.coord = coord;

    if (this.selectedAddressType === AddressType.startAddress) {
      this.startAdressCoord = coord;
      this.additionalAdressCoords = [];
    } else {
      this.additionalAdressCoords.push(coord);
    }
  }

  private centerMap() {
    const coord: LatLngLiteral = this.startAdressCoord;

    this.options.center = latLng(coord.lat, coord.lng);
    this.options.zoom = this.zoom;
    if (this.map) {
      this.map.setView([coord.lat, coord.lng], this.zoom);
    }
  }

  private setLayer() {
    if (this.selectedAddressType === AddressType.startAddress) {
      this.layers = [];
    }

    this.layers.push(marker([this.coord.lat, this.coord.lng], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
    }));
  }

  private setZoomLevel() {
    this.maxZoom = 18;
    this.zoom = 12;
  }

  onMapReady(map: Map): void {
    console.log('onMapReady ', map);
    this.map = map;
  }
}
