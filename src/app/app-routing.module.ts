import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';

import { LeafletExampleComponent } from './leaflet-example/leaflet-example.component';
import { EControlExampleComponent } from './e-control-example/e-control-example.component';
import { GetCoordExampleComponent } from './get-coord-example/get-coord-example.component';
import { FuelPricesMapComponent } from './fuel-prices-map/fuel-prices-map.component';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: 'leaflet', component: LeafletExampleComponent },
      { path: 'e-control', component: EControlExampleComponent },
      { path: 'geocoding', component: GetCoordExampleComponent },
      { path: 'fuel-prices-map', component: FuelPricesMapComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
