import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationBar } from "./shared/components/navigation-bar/navigation-bar";
import { StatisticsService } from "./services/statistics-service";
import { ModalWeekTasks } from "./shared/components/modal-week-tasks/modal-week-tasks";
import { NotificationService } from "./services/notification-service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavigationBar, ModalWeekTasks],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly notificationService = inject(NotificationService);
  protected showWeekTasks = signal<boolean>(this.statisticsService.showWeekTasks());

  async ngOnInit(): Promise<void> {
    await this.notificationService.startListening();
  }
}
