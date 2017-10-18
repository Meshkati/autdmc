import { PersianDatePipe } from './pipes/persian-date.pipe';
import { FileSelectDirective } from 'ng2-file-upload/file-upload/file-select.directive';
import { AuthGuard } from './_guard/auth.guard';
import { AuthenticationService } from './_service/authentication.service';
import { DayCounterPipe } from './pipes/day-counter.pipe';
import { FormsModule } from '@angular/forms';
import { HourMinPipe } from './pipes/hour-min.pipe';
import { PersianNumberPipe } from './pipes/persian-number.pipe';
import { HttpModule } from '@angular/http';
import { DatabaseService } from './_service/database.service';
import { SuiModule } from 'ng2-semantic-ui/dist/public';
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
import { PaymentComponent } from './payment/payment.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DayCounterComponent } from './day-counter/day-counter.component';
import { LoginComponent } from './login/login.component';
import { TeamPanelComponent } from './team-panel/team-panel.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        LandingComponent,
        FooterComponent,
        WorkshopComponent,
        CompetitionComponent,
        PersianNumberPipe,
        HourMinPipe,
        PaymentComponent,
        AdminPanelComponent,
        DayCounterPipe,
        DayCounterComponent,
        LoginComponent,
        TeamPanelComponent,
        FileSelectDirective,
        PersianDatePipe
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            {path: 'landing' , component: LandingComponent, data: { state: 'landing' }},
            {path: 'workshop', component: WorkshopComponent, data: { state: 'workshop' }},
            {path: 'competition', component: CompetitionComponent, data: { state: 'competition' }},
            {path: 'payment', component: PaymentComponent, data: { state: 'payment' }},
            {path: 'spanel', component: AdminPanelComponent},
            {path: 'login', component: LoginComponent},
            {path: 'panel', component: TeamPanelComponent, canActivate: [AuthGuard]},
            {path: '', redirectTo: '/landing', pathMatch: 'full'}

        ]),
        BrowserAnimationsModule,
        SuiModule,
        HttpModule,
        FormsModule
    ],
    providers: [
        DatabaseService,
        AuthenticationService,
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
