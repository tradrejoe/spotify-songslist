import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SongsComponent } from './songs/songs.component';
import { LoginComponent } from './login/login.component';
import { SpotifyService } from './spotify.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  { path: 'songs', component: SongsComponent },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    SongsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, HttpModule, RouterModule.forRoot(routes, { enableTracing: true, useHash: false  })
  ],
  providers: [SpotifyService, HttpModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
