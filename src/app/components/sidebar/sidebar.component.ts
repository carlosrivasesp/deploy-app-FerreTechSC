import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeLink: string = '';
openSubmenu: string | null = null;

ngOnInit() {
  // Solo restaurar estado si fue una recarga
  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    const savedLink = localStorage.getItem('activeLink');
    const savedSubmenu = localStorage.getItem('openSubmenu');
    if (savedLink) {
      this.activeLink = savedLink;
    }
    if (savedSubmenu) {
      this.openSubmenu = savedSubmenu;
    }
  }
}

setActiveLink(link: string): void {
  this.activeLink = link;
  localStorage.setItem('activeLink', link);

  const submenuMap: { [key: string]: string } = {
    'nuevo-pedido': 'submenu1',
    'lista-pedidos': 'submenu1',

    'nuevo-comprobante': 'submenu2',
    'listado-comprobantes': 'submenu2',

    'nueva-cotizacion': 'submenu3',
    'listado-cotizaciones': 'submenu3',

    'productos': 'submenu4',
    'categorias': 'submenu4',
    'marcas': 'submenu4',
    'entregas': 'submenu4',
    'lugares-entrega': 'submenu4',

    'ingresos': 'submenu45',
    'salidas': 'submenu5',
    'devoluciones': 'submenu5',

    'registrar-compra': 'submenu6',
    'listado-compras': 'submenu6',
    'compras-sugeridas': 'submenu6',
  };

  this.openSubmenu = submenuMap[link] || null;
  localStorage.setItem('openSubmenu', this.openSubmenu || '');
}

toggleSubmenu(menuId: string): void {
  this.openSubmenu = this.openSubmenu === menuId ? null : menuId;
}

}
