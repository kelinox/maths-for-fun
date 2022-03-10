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
import { DijkstraComponent } from './dijkstra/dijkstra.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PathfindingComponent,
    HomeComponent,
    GridComponent,
    GridItemComponent,
    DijkstraComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [DijkstraService, AStarService, PathFindingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
