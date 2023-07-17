import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';

import { LeafletService } from '../services/leaflet.service';
import { EControlService } from '../services/e-control.service';
import { IGasStation } from '../model/igas-station';
import { GeocodingService } from '../services/geocoding.service';
import { AddressType } from '../model/address-type';
import { IFuel } from '../model/ifuel';
import { IFuelInfo } from '../model/ifuel-info';

@Component({
  selector: 'app-fuel-prices-map',
  templateUrl: './fuel-prices-map.component.html',
  styleUrls: ['./fuel-prices-map.component.scss'],
})
export class FuelPricesMapComponent implements OnInit, AfterViewInit {
  address!: string;
  includeClosedStations: boolean = false;
  selectedFuelType!: string;
  fuels: IFuel[] = [];
  form!: FormGroup;
  noData: boolean = false;
  gasStations!: IGasStation[];

  private map!: L.Map;
  layers: L.Marker<any>[] = [];
  options!: L.MapOptions;
  coord!: L.LatLngLiteral;
  searchAdressCoord!: L.LatLngLiteral;
  zoom!: number;
  maxZoom!: number;
  selectedAddressType!: AddressType;
  fuelInfo!: IFuelInfo;

  constructor(
    private fb: FormBuilder,
    private eControlService: EControlService,
    private geocodingService: GeocodingService,
    private leafletService: LeafletService
  ) {}

  ngOnInit(): void {
    this.fillFuelArr();
    this.createForm();
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

  createForm(): void {
    this.form = this.fb.group({
      address: ['', Validators.required],
      includeClosedStations: [false],
      selectedFuelType: this.fuels[0].value,
    });
  }

  fillFuelArr() {
    this.fuels = this.eControlService.fillFuelArr();
  }

  searchAddressAndGasStations() {
    console.log('Formulardaten', this.form.value);
    this.address = this.form.controls['address'].value;
    this.selectedFuelType = this.form.controls['selectedFuelType'].value;
    this.includeClosedStations =
      this.form.controls['includeClosedStations'].value;

    this.geocodingService.geocodeAddress(this.address).subscribe((response) => {
      console.log('geocodeAddress', response);
      response.length === 0 ? (this.noData = true) : (this.noData = false);

      if (response.length > 0) {
        this.searchAdressCoord = {
          lat: response[0].lat,
          lng: response[0].lon,
        };
        this.searchGasStations();
      }
    });
  }

  searchGasStations() {
    this.eControlService
      .searchGasStations(
        this.searchAdressCoord.lat,
        this.searchAdressCoord.lng,
        this.selectedFuelType,
        this.includeClosedStations
      )
      .subscribe((response: IGasStation[]) => {
        console.log('searchGasStations response', response);
        response.forEach((station: IGasStation) => console.log(`Station: ${station.name}, Adresse: ${station.location.address}, Preis: ${station.prices[0]?.amount}`));
        response.length === 0 ? (this.noData = true) : (this.noData = false);

        if (!this.noData) {
          this.gasStations = response;
          this.setSearchAddressMarker();
          this.setGasStationsMarker();
        }
      });
  }

  setSearchAddressMarker(): void {
    this.setFuelInfos(true, null);
    this.centerMap();
    this.setLayerWithMarker(true);
  }

  setGasStationsMarker(): void {
    this.gasStations.forEach((gasStation) => {
      console.log('gasStation', gasStation);

      this.setCoordForGasStation(gasStation);
      this.setFuelInfos(false, gasStation);
      this.setLayerWithMarker(false);
    });
  }

  private setCoordForGasStation(gasStation: IGasStation) {
    this.coord = {
      lat: Number(gasStation?.location?.latitude),
      lng: Number(gasStation?.location?.longitude),
    };
  }

  private setFuelInfos(
    isSearchAddress: boolean,
    gasStation: IGasStation | null
  ) {
    const opened = gasStation?.open ? 'geöffnet' : 'geschlossen';

    let amount = "unbekannt";
    let fuelType = "unbekannt";
    const pricesArr = gasStation?.prices  ? gasStation?.prices : [];
    console.log('pricesArr', pricesArr);
    if (pricesArr.length > 0) {
      amount = pricesArr[0].amount;
      fuelType = pricesArr[0].label;
    }

    if (isSearchAddress) {
      this.fuelInfo = {
        name: `${gasStation?.name}`,
        city: `${gasStation?.location.postalCode}  ${gasStation?.location.city}` ,
        address: `${gasStation?.location.address}`,
        addressType: 'Suchadresse',
      };
    } else {
      this.fuelInfo = {
        name: `${gasStation?.name}`,
        city: `${gasStation?.location.postalCode}  ${gasStation?.location.city}` ,
        address: `${gasStation?.location.address}`,
        price: `${amount}`,
        fuelType: `${fuelType}`,
        opened: `${opened}`,
      };
    }
  }

  private centerMap() {
    const coord: L.LatLngLiteral = this.searchAdressCoord;

    this.options.center = L.latLng(coord.lat, coord.lng);
    this.options.zoom = this.zoom;
    if (this.map) {
      this.map.setView([coord.lat, coord.lng], this.zoom);
    }
  }

  private setLayerWithMarker(isSearchAddress: boolean): void {
    if (isSearchAddress) {
      this.layers = [];
    }
    const coord = isSearchAddress ? this.searchAdressCoord : this.coord;

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
      .bindTooltip(this.getTooltipText(isSearchAddress))
      .bindPopup(
        isSearchAddress
          ? this.getPopupTextForSearchAddress()
          : this.getPopupTextForGasStation()
      );

    this.layers.push(marker);
  }

  // TODO aufsplitten auf Tankstelle u Suchadresse
  // sortieren und Ranking
  private getTooltipText(isSearchAddress: boolean): string {
    const styleBold = 'style="font-weight: bold;"';

    let styleColor = 'style="color: black;"';
    if (isSearchAddress) {
      styleColor = 'style="color: red;"';
    }
    return `<div ${styleBold}>${this.fuelInfo.name}</div><div ${styleColor}>${this.fuelInfo.city}</div>, <div ${styleColor}>${this.fuelInfo.price}</div>`;
  }

  private getPopupTextForGasStation(): string {
    const coord = this.coord;

    const table = `<table>
      <tr>
        <th colspan="2">Tankstelle ${this.fuelInfo.opened}</th>
      </tr>
      <tr>
        <td>Name</td>
        <td>${this.fuelInfo.name}</td>
      </tr>
      <tr>
      <td>Ort</td>
      <td>${this.fuelInfo.city}</td>
      </tr>
      <tr>
        <td>Strasse</td>
        <td>${this.fuelInfo.address}</td>
      </tr>
      <tr>
        <td>Preis</td>
        <td>${this.fuelInfo.price}</td>
      </tr>
      <tr>
        <td>Treibstoff</td>
        <td>${this.fuelInfo.fuelType}</td>
      </tr>
      <tr>
        <td>Breitengrad</td>
        <td>${coord.lat}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${coord.lng}</td>
      </tr>
    </table>`;

    return table;
  }

  private getPopupTextForSearchAddress(): string {
    const coord = this.searchAdressCoord;

    const table = `<table>
      <tr>
        <th colspan="2">Gesuchte Adresse</th>
      </tr>
      <tr>
        <td>Typ</td>
        <td>${this.fuelInfo.addressType}</td>
      </tr>
      <tr>
        <td>Ort</td>
        <td>${this.fuelInfo.city}</td>
      </tr>
      <tr>
        <td>Strasse</td>
        <td>${this.fuelInfo.address}</td>
      </tr>
      <tr>
        <td>Breitengrad</td>
        <td>${coord.lat}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${coord.lng}</td>
      </tr>
    </table>`;

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
