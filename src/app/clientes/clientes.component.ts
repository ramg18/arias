import { Component } from '@angular/core';
import { ClientesAuthService } from './services/clientes-auth.service';

type TabId = 'facturas' | 'comprobante' | 'nomina';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  activeTab: TabId = 'facturas';

  readonly tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'facturas', label: 'CLIENTES.TAB_FACTURAS', icon: 'fa-file-invoice' },
    { id: 'comprobante', label: 'CLIENTES.TAB_COMPROBANTE', icon: 'fa-receipt' },
    { id: 'nomina', label: 'CLIENTES.TAB_NOMINA', icon: 'fa-money-bill-wave' }
  ];

  constructor(public auth: ClientesAuthService) {}

  onKeydown(event: KeyboardEvent, index: number): void {
    // Navegación por flechas entre tabs (WAI-ARIA tabs).
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + this.tabs.length) % this.tabs.length;
    else return;
    event.preventDefault();
    this.activeTab = this.tabs[next].id;
    setTimeout(() => document.getElementById('tab-' + this.activeTab)?.focus());
  }

  logout(): void {
    this.auth.logout();
    this.activeTab = 'facturas';
  }
}
