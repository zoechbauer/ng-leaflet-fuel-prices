import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { EControlService } from '../services/e-control.service';
import { IGasStation } from '../model/igas-station';
import { GeocodingService } from '../services/geocoding.service';
import { LatLngLiteral } from 'leaflet';

interface Fuel {
  value: string;
  displayValue: string;
}

@Component({
  selector: 'app-e-control-example',
  templateUrl: './e-control-example.component.html',
  styleUrls: ['./e-control-example.component.scss'],
})
export class EControlExampleComponent implements OnInit {
  dataSource!: MatTableDataSource<IGasStation>;
  displayedColumns: string[] = [
    'name',
    'location.city',
    'location.address',
    'open',
    'prices[0].amount',
  ];

  coordinates!: LatLngLiteral;
  address!: string;
  includeClosedStations: boolean = false;
  selectedFuelType!: string;
  fuels: Fuel[] = [];
  form!: FormGroup;
  noData: boolean = false;

  gasStations!: IGasStation[];
  selectedGasStation!: IGasStation;

  constructor(
    private fb: FormBuilder,
    private eControlService: EControlService,
    private geocodingService: GeocodingService
  ) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.fillFuelArr();
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      address: ['', Validators.required],
      includeClosedStations: [false],
      selectedFuelType: this.fuels[0].value,
    });
  }

  fillFuelArr() {
    this.fuels = [
      { displayValue: 'Diesel', value: 'DIE' },
      { displayValue: 'Super', value: 'SUP' },
      { displayValue: 'Gas', value: 'GAS' },
    ];
  }


  searchAddressAndGasStations() {
    console.log('Formulardaten', this.form.value);
    this.address = this.form.controls['address'].value;
    this.selectedFuelType = this.form.controls['selectedFuelType'].value;
    this.includeClosedStations = this.form.controls['includeClosedStations'].value;

    this.geocodingService.geocodeAddress(this.address).subscribe((response) => {
      console.log('geocodeAddress', response);

      if (response.length > 0) {
        this.coordinates = {
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
        this.coordinates.lat,
        this.coordinates.lng,
        this.selectedFuelType,
        this.includeClosedStations
      )
      .subscribe((response: IGasStation[]) => {
        console.log('response', response);
        response.length === 0 ? this.noData = true : this.noData = false;

        this.gasStations = response;
        this.setTableDataSource();
      });
  }

  private setTableDataSource() {
        this.dataSource = new MatTableDataSource<IGasStation>(this.gasStations);

        this.dataSource.sortingDataAccessor = (
          data: object,
          sortHeaderId: string
        ): string | number => {
          const propPath = sortHeaderId.split('.');
          console.log('propPath', propPath);

          const value: any = propPath.reduce(
            (curObj: any, property: string) => {
              console.log('curObj', curObj);
              console.log('property', property);

              if (property === 'amount') {
                // prices array can be empty
                if (curObj) {
                  console.log('prices length', curObj.prices.length);
                  if (curObj.prices.length > 0) {
                    return curObj[property];
                  } else {
                    return 0.0;
                  }
                }
              } else {
                return curObj[property];
              }
            },
            data
          );
          return !isNaN(value) ? Number(value) : value;
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTableRecord(row: IGasStation) {
    console.log('row', row);
    this.selectedGasStation = row;
  }
}
