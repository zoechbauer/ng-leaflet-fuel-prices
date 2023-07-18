import { Injectable } from '@angular/core';
import { IFuelInfo } from '../model/ifuel-info';
import { AddressType } from '../model/address-type';

@Injectable({
  providedIn: 'root'
})
export class PopupTooltipService {

  constructor() { }

  getTooltipTextForSearchAddress(searchAddress: string): string {
    const styleBold = 'style="font-weight: bold;"';
    const styleColor = 'style="color: red;"';
    const titel = "Suchadresse";
    return `<div ${styleBold}>${titel}</div><div ${styleColor}>${searchAddress}</div>`;
  }

  getTooltipText(fuelInfo: IFuelInfo): string {
    const styleBold = 'style="font-weight: bold;"';
    const styleColor = 'style="color: black;"';
    return `<div ${styleBold}>${fuelInfo.name}</div><div ${styleColor}>${fuelInfo.city}</div>, <div ${styleColor}>${fuelInfo.price}</div>`;
  }

  getPopupTextForGasStation(coord: L.LatLngLiteral, fuelInfo: IFuelInfo): string {
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
        <td>Preis</td>
        <td>${fuelInfo.price}</td>
      </tr>
      <tr>
        <td>Treibstoff</td>
        <td>${fuelInfo.fuelType}</td>
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

  getPopupTextForSearchAddress(coord: L.LatLngLiteral, fuelInfo: IFuelInfo): string {
    const table = `<table>
      <tr>
        <th colspan="2">Gesuchte Adresse</th>
      </tr>
      <tr>
        <td>Typ</td>
        <td>${fuelInfo.addressType}</td>
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

  getTooltipTextForLeafletEx(isStartAddress: boolean, selectedAddressType: AddressType, address: string): string {
    const styleBold = 'style="font-weight: bold;"';

    let styleColor = 'style="color: black;"';
    if (isStartAddress) {
      styleColor = 'style="color: red;"'
    }
    return `<div ${styleBold}>${address}</div><div ${styleColor}>${selectedAddressType.toString()}</div>`;
  }

  getPopupTextForLeafletEx(coord: L.LatLngLiteral, selectedAddressType: AddressType, address: string): string {
    const table =
    `<table>
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
        <td>${coord.lat}</td>
      </tr>
      <tr>
        <td>Längengrad</td>
        <td>${coord.lng}</td>
      </tr>
    </table>`

    return table;
  }

}
