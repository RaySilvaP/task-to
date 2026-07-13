import { Routes } from "@angular/router";
import { KanbanPage } from "./pages/kanban-page/kanban-page";
import { TimelinePage } from "./pages/timeline-page/timeline-page";

export const routes: Routes = [
  {
    path: 'kanban',
    component: KanbanPage,
    title: 'Kanban'
  },
  {
    path: 'timeline',
    component: TimelinePage,
    title: 'Timeline'
  },
  {
    path: '**',
    redirectTo: '/timeline'
  }
];
