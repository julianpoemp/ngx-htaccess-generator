import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from './transloco-root.module';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgToggleModule} from '@nth-cloud/ng-toggle';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FormsModule} from '@angular/forms';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {TroubleShootingComponent} from './pages/trouble-shooting/trouble-shooting.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {GeneratorComponent} from './pages/generator/generator.component';
import {HelpfulResourcesComponent} from './pages/helpful-resources/helpful-resources.component';
import {PreviewTerminalComponent} from './pages/generator/preview-terminal/preview-terminal.component';
import {QuestionFormComponent} from './pages/generator/question-form/question-form.component';
import {NgxCodejarModule} from 'ngx-codejar';
import {AlertModule} from 'ngx-bootstrap/alert';
import {FurtherInformationComponent} from './pages/further-information/further-information.component';

@NgModule({
  declarations: [
    AppComponent,
    TroubleShootingComponent,
    NavbarComponent,
    GeneratorComponent,
    HelpfulResourcesComponent,
    PreviewTerminalComponent,
    QuestionFormComponent,
    FurtherInformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    NgToggleModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    NtkmeButtonModule,
    TooltipModule.forRoot(),
    NgxCodejarModule,
    AlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
