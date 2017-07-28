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
            {path: 'landing' , component: LandingComponent},
            {path: '', redirectTo: '/landing', pathMatch: 'full'}

        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
