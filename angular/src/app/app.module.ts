import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
// import { GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    HighchartsChartModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    // GoogleMapsModule,
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyD9BnEyrsA8HgeAJcisPy7Qkege1nFpltM"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }