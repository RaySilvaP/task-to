import { Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationBar } from "./shared/components/navigation-bar/navigation-bar";
import { StatisticsService } from "./services/statistics-service";
import { ModalWeekTasks } from "./shared/components/modal-week-tasks/modal-week-tasks";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavigationBar, ModalWeekTasks],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  private readonly statisticsService = inject(StatisticsService);
  protected showWeekTasks = signal<boolean>(this.statisticsService.showWeekTasks());

}
