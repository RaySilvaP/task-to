import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationBar } from "./shared/components/navigation-bar/navigation-bar";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavigationBar],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
}
