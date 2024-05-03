import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, HomeComponent, AuthComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [provideRouter(routes)],
  bootstrap: [AppComponent, HomeComponent, AuthComponent],
})
export class AppModule {}
