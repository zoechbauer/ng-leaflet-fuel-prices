import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

import { GeocodingService } from '../services/geocoding.service';


@Component({
  selector: 'app-get-coord-example',
  templateUrl: './get-coord-example.component.html',
  styleUrls: ['./get-coord-example.component.scss']
})
export class GetCoordExampleComponent implements OnInit{
  form!: FormGroup;
  search: boolean = false;
  displayName: string = "";
  coordinates!: L.LatLngLiteral;
  latDeg: string = "";
  lngDeg: string = "";

  constructor(private geocodingService: GeocodingService, private fb: FormBuilder) {}

  ngOnInit(): void {
      this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      address: ['', Validators.required]
    });
  }

  searchAddress() {
    this.clearResult();

    this.geocodingService.geocodeAddress(this.form.controls["address"].value).subscribe(response => {
      this.search = true;
      console.log(response);

      if (response.length > 0) {
        this.coordinates = {
          lat: response[0].lat,
          lng: response[0].lon
        };
        this.displayName = response[0].display_name;

        this.calcCoordInDeg();
      }
    });
  }

  noData(): boolean {
    return this.coordinates?.lat === 0 && this.coordinates?.lng === 0;
  }

  private clearResult() {
    this.coordinates = {
      lat: 0,
      lng: 0
    };
  }

  private calcCoordInDeg(): void {
    this.latDeg = this.geocodingService.convertCoordinate(this.coordinates.lat);
    this.lngDeg = this.geocodingService.convertCoordinate(this.coordinates.lng);
  }
}
