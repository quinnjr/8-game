import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./puzzle/puzzle.component').then(m => m.PuzzleComponent) }
];
