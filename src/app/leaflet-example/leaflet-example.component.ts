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

@Component({
  selector: 'app-leaflet-example',
  templateUrl: './leaflet-example.component.html',
  styleUrls: ['./leaflet-example.component.scss'],
})
export class LeafletExampleComponent implements OnInit {
  zoom: number = 16;
  maxZoom: number = 18;
  private map!: Map;
  coord!: LatLngLiteral;
  address!: string;
  layers: Marker<any>[] = [];
  options!: MapOptions;

  constructor(
    private http: HttpClient,
    private leafletService: LeafletService
  ) {}

  ngOnInit(): void {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: this.maxZoom,
          attribution: '&copy; OpenStreetMap',
        }),
      ],
      zoom: this.zoom,
      center: latLng(48.2082, 16.3738),
    };
  }

  searchAddressAndSetMarker() {
    this.leafletService.getLatLngByAddress(this.address)
      .subscribe((coord: LatLngLiteral) => {
        console.log('***coord', coord);
        this.coord = coord;

        this.options.center = latLng(coord.lat, coord.lng);
        this.options.zoom = this.zoom;
        if (this.map) {
          this.map.setView([coord.lat, coord.lng], this.zoom);
        }

        this.layers = [
          marker([coord.lat, coord.lng], {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [13, 41],
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png',
            }),
          }),
        ];
        console.log('center', this.options.center);

      });
  }

  onMapReady(map: Map) {
    console.log('onMapReady ', map);
    this.map = map;
  }
}
