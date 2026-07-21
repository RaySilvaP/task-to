import { Routes } from "@angular/router";
import { KanbanPage } from "./pages/kanban-page/kanban-page";
import { TimelinePage } from "./pages/timeline-page/timeline-page";
import { PomodoroPage } from "./pages/pomodoro-page/pomodoro-page";

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
    path: 'pomodoro',
    component: PomodoroPage,
    title: 'Pomodoro'
  },
  {
    path: '**',
    redirectTo: '/timeline'
  }
];
