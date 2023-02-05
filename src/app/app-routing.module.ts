import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TroubleShootingComponent} from './pages/trouble-shooting/trouble-shooting.component';
import {GeneratorComponent} from './pages/generator/generator.component';
import {HelpfulResourcesComponent} from './pages/helpful-resources/helpful-resources.component';
import {FurtherInformationComponent} from './pages/further-information/further-information.component';


const routes: Routes = [
  {path: 'generator', component: GeneratorComponent, pathMatch: 'full'},
  {path: 'trouble-shooting', component: TroubleShootingComponent, pathMatch: 'full'},
  {path: 'further-information', component: FurtherInformationComponent, pathMatch: 'full'},
  {path: 'helpful-resources', component: HelpfulResourcesComponent, pathMatch: 'full'},
  {path: '**', redirectTo: 'generator'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
