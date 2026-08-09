import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface TenantConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID); // Identificador del entorno (servidor o navegador)

  private tenants: Record<string, TenantConfig> = {
    default: {
      id: 'default',
      name: 'Sistema Central',
      primaryColor: '#3f51b5',
      secondaryColor: '#ff4081',
    },
    uptaeb: {
      id: 'uptaeb',
      name: 'Universidad Politécnica Territorial del Estado Lara',
      primaryColor: '#b71c1c',
      secondaryColor: '#f44336',
    },
  };

  private currentTenant!: TenantConfig;

  public loadTenantConfiguration(): Promise<void> {
    return new Promise((resolve) => {
      // Verificamos si estamos en el navegador de manera segura
      if (isPlatformBrowser(this.platformId)) {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        this.currentTenant = this.tenants[subdomain] || this.tenants['default'];
      } else {
        // Si se ejecuta en el servidor (SSR), usamos por defecto el central
        this.currentTenant = this.tenants['default'];
      }

      // Aplicamos las variables CSS globales
      const root = this.document.documentElement;
      root.style.setProperty('--primary-color', this.currentTenant.primaryColor);
      root.style.setProperty('--secondary-color', this.currentTenant.secondaryColor);

      console.log(`[Motor Multi-Tenant] Configuración cargada para: ${this.currentTenant.name}`);
      resolve();
    });
  }

  public getTenant(): TenantConfig {
    return this.currentTenant;
  }
}
