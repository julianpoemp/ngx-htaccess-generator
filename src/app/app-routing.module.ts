import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TroubleShootingComponent} from './pages/trouble-shooting/trouble-shooting.component';
import {GeneratorComponent} from './pages/generator/generator.component';


const routes: Routes = [
  {path: 'generator', component: GeneratorComponent, pathMatch: 'full'},
  {path: 'trouble-shooting', component: TroubleShootingComponent, pathMatch: 'full'},
  {path: '**', redirectTo: 'generator'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
