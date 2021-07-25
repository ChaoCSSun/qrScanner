import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'scan-code',
    pathMatch: 'full',
  },
  {
    path: 'scan-code',
    loadChildren: () =>
      import('./scan-code/scan-code.module').then((m) => m.ScanCodePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
