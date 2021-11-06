import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersChartComponent } from './players-chart/players-chart.component';
import { HeaderComponent } from './header/header/header.component';
import { HeaderLogoComponent } from './header/header-logo-section/header-logo-section.component';
import { HeaderMenuComponent } from './header/header-menu/header-menu.component';

@NgModule({
  declarations: [	
    AppComponent,
      PlayersChartComponent,
      HeaderComponent,
      HeaderMenuComponent,
      HeaderLogoComponent
      
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
