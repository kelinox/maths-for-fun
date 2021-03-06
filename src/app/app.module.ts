import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { PathfindingComponent } from './pages/pathfinding/pathfinding.component';
import { HomeComponent } from './pages/home/home.component';
import { GridComponent } from './components/grid/grid.component';
import { GridItemComponent } from './components/grid-item/grid-item.component';
import { DijkstraService } from './services/dijkstra.service';
import { FormsModule } from '@angular/forms';
import { AStarService } from './services/a-star.service';
import { PathFindingService } from './services/path-finding.service';
import { DijkstraComponent } from './pages/dijkstra/dijkstra.component';
import { SortingComponent } from './pages/sorting/sorting.component';
import { Graph } from './models/graph';
import { TreeComponent } from './pages/tree/tree.component';
import { Tree } from './models/tree';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PathfindingComponent,
    HomeComponent,
    GridComponent,
    GridItemComponent,
    DijkstraComponent,
    SortingComponent,
    TreeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [DijkstraService, AStarService, PathFindingService, Graph, Tree],
  bootstrap: [AppComponent],
})
export class AppModule {}
