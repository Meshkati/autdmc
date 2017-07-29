import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';
import { FooterComponent } from './footer/footer.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { CompetitionComponent } from './competition/competition.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        LandingComponent,
        FooterComponent,
        WorkshopComponent,
        CompetitionComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            {path: 'landing' , component: LandingComponent, data: { state: 'landing' }},
            {path: 'workshop', component: WorkshopComponent, data: { state: 'workshop' }},
            {path: '', redirectTo: '/landing', pathMatch: 'full'}

        ]),
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
