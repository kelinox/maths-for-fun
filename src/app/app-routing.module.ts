import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DijkstraComponent } from './pages/dijkstra/dijkstra.component';
import { HomeComponent } from './pages/home/home.component';
import { PathfindingComponent } from './pages/pathfinding/pathfinding.component';
import { SortingComponent } from './pages/sorting/sorting.component';
import { TreeComponent } from './pages/tree/tree.component';

const routes: Routes = [
  { path: 'pathfinding', component: PathfindingComponent },
  { path: 'dijkstra', component: DijkstraComponent },
  { path: 'sorting', component: SortingComponent },
  { path: 'tree', component: TreeComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
