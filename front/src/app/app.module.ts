import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { KidsComponent } from './kids/kids.component';
import { EstacionamentoComponent } from './estacionamento/estacionamento.component';
import { HomeComponent } from './home/home.component';
import { UtilService } from './Service/util.service';

export function initializeApp(utilService: UtilService): () => Promise<void> {
  return () => utilService.loadConfig();
}


@NgModule({
  declarations: [
    AppComponent,
    KidsComponent,
    EstacionamentoComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [UtilService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
