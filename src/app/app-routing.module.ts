import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DijkstraComponent } from './dijkstra/dijkstra.component';
import { HomeComponent } from './pages/home/home.component';
import { PathfindingComponent } from './pages/pathfinding/pathfinding.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pathfinding', component: PathfindingComponent },
  { path: 'dijkstra', component: DijkstraComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
