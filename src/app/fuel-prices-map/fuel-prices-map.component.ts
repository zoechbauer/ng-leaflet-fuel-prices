import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { filter, from, map } from 'rxjs';

import { LeafletService } from '../services/leaflet.service';
import { EControlService } from '../services/e-control.service';
import { IGasStation } from '../model/igas-station';
import { GeocodingService } from '../services/geocoding.service';
import { AddressType } from '../model/address-type';
import { IFuel } from '../model/ifuel';
import { IFuelInfo } from '../model/ifuel-info';
import { PopupTooltipService } from '../services/popup-tooltip.service';

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
  layers: L.Layer[] = [];
  options!: L.MapOptions;
  coord!: L.LatLngLiteral;
  searchAdressCoord!: L.LatLngLiteral;
  zoom!: number;
  maxZoom!: number;
  selectedAddressType!: AddressType;
  fuelInfo!: IFuelInfo;
  priceRankingMap!: Map<number, number>

  constructor(
    private fb: FormBuilder,
    private eControlService: EControlService,
    private geocodingService: GeocodingService,
    private leafletService: LeafletService,
    private popupTooltipService: PopupTooltipService
  ) {}

  ngOnInit(): void {
    this.fillFuelArr();
    this.createForm();
    this.selectedAddressType = AddressType.startAddress;
    this.setZoomLevel();
  }

  ngAfterViewInit(): void {
    this.options = this.leafletService.initMapOptions(this.options, this.zoom, this.maxZoom);
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
        const data = response[0];
        this.searchAdressCoord = {
          lat: data.lat,
          lng: data.lon,
        };
        this.address = data.display_name;

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
          this.createPriceRanking();
          this.setSearchAddressMarker();
          this.setGasStationsMarker();
        }
      });
  }

  private createPriceRanking() {
    this.priceRankingMap = new Map<number, number>();
    let i = 1;

    from(this.gasStations).pipe(
      map(gs => gs.prices),
      filter(prices => prices.length > 0),
      map(prices => prices[0]),
      map(priceObj => priceObj["amount"])
    ).subscribe(price => {
      this.priceRankingMap.set(+price, i++)
    });
    console.log('priceRankingMap',this.priceRankingMap);
  }

  setSearchAddressMarker(): void {
    this.setFuelInfos(true, null);
    this.centerMap();
    this.setLayerWithMarker(true);
  }

  setGasStationsMarker(): void {
    this.gasStations.forEach((gasStation) => {
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
    if (pricesArr.length > 0) {
      amount = pricesArr[0].amount;
      fuelType = pricesArr[0].label;
    }

    if (!isSearchAddress) {
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
    this.leafletService.centerMap(this.map, this.options, coord, this.zoom);
  }

  private setLayerWithMarker(isSearchAddress: boolean): void {
    const coord = isSearchAddress ? this.searchAdressCoord : this.coord;
    this.layers = this.leafletService.setLayerWithMarker(isSearchAddress, this.address, this.fuelInfo, this.layers, coord, this.priceRankingMap);
  }

  private setZoomLevel() {
    this.maxZoom = 18;
    this.zoom = 12;
  }

  onMapReady(map: L.Map): void {
    this.map = map;
  }
}
