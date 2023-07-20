import { Injectable } from '@angular/core';
import { IFuelInfo } from '../model/ifuel-info';
import { AddressType } from '../model/address-type';
import { GeocodingService } from './geocoding.service';

@Injectable({
  providedIn: 'root',
})
export class PopupTooltipService {
  constructor(private geocodingService: GeocodingService) {}

  getTooltipTextForSearchAddress(searchAddress: string): string {
    const styleBold = 'style="font-weight: bold;"';
    const styleColor = 'style="color: red;"';
    const titel = 'Ermittelte Adresse aus Suchadresse';
    return `<div ${styleBold}>${titel}</div><div ${styleColor}>${searchAddress}</div>`;
  }

  getTooltipText(fuelInfo: IFuelInfo): string {
    const styleBold = 'style="font-weight: bold;"';
    const styleColor = 'style="color: black;"';
    return `<div ${styleBold}>${fuelInfo.name}</div><div ${styleColor}>${fuelInfo.city}</div><div ${styleColor}>${fuelInfo.address}</div><div ${styleColor}>${this.getRanking(fuelInfo, true)}</div><div ${styleColor}>${this.formatPrice(fuelInfo, true)}</div>`;
  }

  getPopupTextForGasStation(
    coord: L.LatLngLiteral,
    fuelInfo: IFuelInfo
  ): string {
    const table = `<table>
      <tr>
        <th colspan="2">Tankstelle ${fuelInfo.opened}</th>
      </tr>
      <tr>
        <td>Name</td>
        <td>${fuelInfo.name}</td>
      </tr>
      <tr>
      <td>Ort</td>
      <td>${fuelInfo.city}</td>
      </tr>
      <tr>
        <td>Strasse</td>
        <td>${fuelInfo.address}</td>
      </tr>
      <tr>
        <td>Rang</td>
        <td>${this.getRanking(fuelInfo, false)}</td>
      </tr>
      <tr>
        <td>Preis</td>
        <td>${this.formatPrice(fuelInfo, false)}</td>
      </tr>
      <tr>
        <td>Treibstoff</td>
        <td>${fuelInfo.fuelType}</td>
      </tr>
      <tr>
        <td>Breitengrad</td>
        <td>${this.geocodingService.convertCoordinate(coord.lat)}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${this.geocodingService.convertCoordinate(coord.lng)}</td>
      </tr>
    </table>`;

    return table;
  }

  getPopupTextForSearchAddress(
    coord: L.LatLngLiteral,
    searchAddress: string
  ): string {
    const table = `<table>
      <tr>
        <th colspan="2">Tankstellen werden gesucht für:</th>
      </tr>
      <tr>
        <td>Adresse</td>
        <td>${searchAddress}</td>
      </tr>
      <tr>
        <td>Breitengrad</td>
        <td>${this.geocodingService.convertCoordinate(coord.lat)}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${this.geocodingService.convertCoordinate(coord.lng)}</td>
      </tr>
    </table>`;

    return table;
  }

  getTooltipTextForLeafletEx(
    isStartAddress: boolean,
    selectedAddressType: AddressType,
    address: string
  ): string {
    const styleBold = 'style="font-weight: bold;"';

    let styleColor = 'style="color: black;"';
    if (isStartAddress) {
      styleColor = 'style="color: red;"';
    }
    return `<div ${styleBold}>${address}</div><div ${styleColor}>${selectedAddressType.toString()}</div>`;
  }

  getPopupTextForLeafletEx(
    coord: L.LatLngLiteral,
    selectedAddressType: AddressType,
    address: string
  ): string {
    const table = `<table>
      <tr>
        <th colspan="2">Detailinformationen</th>
      </tr>
      <tr>
        <td>Typ</td>
        <td>${selectedAddressType}</td>
      </tr>
      <tr>
        <td>Adresse</td>
        <td>${address}</td>
      </tr>
      <tr>
        <td>Breitengrad</td>
        <td>${this.geocodingService.convertCoordinate(coord.lat)}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${this.geocodingService.convertCoordinate(coord.lng)}</td>
      </tr>
    </table>`;

    return table;
  }

  private formatPrice(fuelInfo: IFuelInfo, withFuelType: boolean): string {
    if (fuelInfo.price === "unbekannt") {
      return "<b>keine Preisinformationen verfügbar!</b>"
    }

    let price =  "<b>" + fuelInfo.price?.replace(".", ",") + ' €' + "</b>";

    if (withFuelType) {
      return price + " / " + fuelInfo.fuelType;
    } else {
      return price;
    }
  }

  private getRanking(fuelInfo: IFuelInfo, withLabel: boolean): string {
    if (fuelInfo.price === "unbekannt") {
      return ""
    }

    let label = "<b>Rang: </b>";
    let ranking = `<b>${fuelInfo.ranking}</b>`

    if (withLabel) {
      return label + ranking;
    } else {
      return ranking;
    }
  }

}
