import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from './material.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LeafletExampleComponent } from './leaflet-example/leaflet-example.component';
import { EControlExampleComponent } from './e-control-example/e-control-example.component';
import { GetCoordExampleComponent } from './get-coord-example/get-coord-example.component';
import { FuelPricesMapComponent } from './fuel-prices-map/fuel-prices-map.component';
import { FileDialogContentComponent } from './file-dialog-content/file-dialog-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SidenavComponent,
    LeafletExampleComponent,
    EControlExampleComponent,
    GetCoordExampleComponent,
    FuelPricesMapComponent,
    FileDialogContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LeafletModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
