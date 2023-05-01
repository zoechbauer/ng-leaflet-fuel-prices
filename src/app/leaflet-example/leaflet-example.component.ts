import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  marker,
  icon,
  latLng,
  Map,
  MapOptions,
  tileLayer,
  Marker,
} from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leaflet-example',
  templateUrl: './leaflet-example.component.html',
  styleUrls: ['./leaflet-example.component.scss'],
})
export class LeafletExampleComponent implements OnInit {
  zoom: number = 16;
  private map!: Map;
  latitude!: number;
  longitude!: number;
  address!: string;
  layers: Marker<any>[] = [];
  options!: MapOptions;


  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap',
        }),
      ],
      zoom: this.zoom,
      center: latLng(48.2082, 16.3738),
    };
  }

  search() {
    this.http
      .get<any[]>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: this.address,
          format: 'json',
        },
      })
      .subscribe((data) => {
        console.log('data', data);

        if (data.length > 0) {
          this.latitude = data[0].lat;
          this.longitude = data[0].lon;

          this.options.center = latLng(this.latitude, this.longitude);
          this.options.zoom = this.zoom;
          if (this.map) {
            this.map.setView([this.latitude, this.longitude], 18);
          }

          this.layers = [
            marker([this.latitude, this.longitude], {
              icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png',
              }),
            }),
          ];
          console.log('center', this.options.center);

          // Trigger a change detection cycle to update the view
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  onMapReady(map: Map) {
    console.log('onMapReady ', map);
    this.map = map;
  }
}
