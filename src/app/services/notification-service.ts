import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { addPluginListener } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private router = inject(Router);

  public async startListening() {
    return await addPluginListener('alarm', 'newIntent', (route: string) => {
      console.log("newIntent")
      this.router.navigate([route]);
    })
  }
}
