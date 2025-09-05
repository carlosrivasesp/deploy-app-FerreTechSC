// sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private sidebarVisibility = new BehaviorSubject<boolean>(true);  // Por defecto, el sidebar está visible
    sidebarVisibility$ = this.sidebarVisibility.asObservable();  // Exponemos el Observable

    constructor() { }

    // Método para ocultar el sidebar
    hideSidebar() {
        this.sidebarVisibility.next(false);
    }

    // Método para mostrar el sidebar
    showSidebar() {
        this.sidebarVisibility.next(true);
    }
}
