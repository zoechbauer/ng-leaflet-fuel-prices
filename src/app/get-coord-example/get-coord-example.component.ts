import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LatLngLiteral } from 'leaflet';

import { GeocodingService } from '../services/geocoding.service';


@Component({
  selector: 'app-get-coord-example',
  templateUrl: './get-coord-example.component.html',
  styleUrls: ['./get-coord-example.component.scss']
})
export class GetCoordExampleComponent implements OnInit{
  form!: FormGroup;
  coordinates!: LatLngLiteral;
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
    this.geocodingService.geocodeAddress(this.form.controls["address"].value).subscribe(response => {
      if (response.length > 0) {
        this.coordinates = {
          lat: response[0].lat,
          lng: response[0].lon
        };
        this.calcCoordInDeg();
      }
    });
  }

  private calcCoordInDeg(): void {
    this.calcCoordDeg(this.coordinates.lat, true);
    this.calcCoordDeg(this.coordinates.lng, false);
  }

  private calcCoordDeg(latLng: number, isLat: boolean): void {
    let deg: number, min: number, sec: number, result:number, decimals: number;

    deg = Math.floor(latLng);
    decimals = latLng - deg;

    result = decimals * 60;
    min = Math.floor(result);
    decimals = result - min;

    sec = Math.round(decimals * 60);

    if (isLat) {
      this.latDeg = `${deg}° ${min}" ${sec}'`;
    } else {
      this.lngDeg = `${deg}° ${min}" ${sec}'`;
    }
  }

}