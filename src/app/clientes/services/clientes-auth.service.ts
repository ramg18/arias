import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClienteSession {
  /** Email del cliente: es el valor que se envía al webhook como `usuario`. */
  usuario: string;
  nombre?: string;
  empresa?: string;
  /** Áreas habilitadas en el CRM (DOCUMENTOS, FACTURACION, ...). */
  areas: string[];
  /** Epoch (ms) en que expira el accessToken. */
  expiresAt: number;
}

/** Respuesta de POST /login (vía proxy). */
interface LoginResponse {
  allowed?: boolean;
  reason?: string;
  accessToken?: string;
  expiresInSeconds?: number;
  user?: {
    email: string;
    fullName?: string;
    areas?: string[];
    client?: { name?: string };
  };
}

export interface ClienteCredentials {
  email: string;
  password: string;
}

/**
 * Sesión de clientes, separada de AuthService (admin/blog) para que una
 * sesión no abra la otra.
 */
@Injectable({ providedIn: 'root' })
export class ClientesAuthService {
  private readonly USER_KEY = 'arias_cliente_user';
  private readonly TOKEN_KEY = 'arias_cliente_token';
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  private session$ = new BehaviorSubject<ClienteSession | null>(null);
  readonly currentUser$ = this.session$.asObservable();

  // HttpBackend evita el AuthInterceptor (que adjunta el token de admin).
  private http: HttpClient;

  constructor(
    handler: HttpBackend,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.http = new HttpClient(handler);
    this.loadSession();
  }

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  private loadSession(): void {
    const raw = this.storage?.getItem(this.USER_KEY);
    const token = this.storage?.getItem(this.TOKEN_KEY);
    if (!raw || !token) return;
    try {
      const user: ClienteSession = JSON.parse(raw);
      if (!user.expiresAt || user.expiresAt <= Date.now()) {
        this.logout();
        return;
      }
      this.session$.next(user);
      this.scheduleExpiry(user.expiresAt);
    } catch {
      this.logout();
    }
  }

  /** Cierra la sesión automáticamente cuando vence el token. */
  private scheduleExpiry(expiresAt: number): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    if (!isPlatformBrowser(this.platformId)) return;
    // setTimeout admite máx. ~24.8 días; el token dura minutos.
    this.expiryTimer = setTimeout(() => this.logout(), Math.max(0, expiresAt - Date.now()));
  }

  /**
   * Login vía proxy propio (/api/clientes/login → CRM). El CRM responde 200 con
   * `allowed: true` o `allowed: false` + `reason`; los errores de formato son 400.
   */
  login(credentials: ClienteCredentials): Observable<ClienteSession> {
    return this.http.post<LoginResponse>(environment.clientes.loginUrl, credentials).pipe(
      map(res => {
        if (res?.allowed === false || !res?.user || !res?.accessToken) {
          throw new Error(res?.reason ?? 'denied');
        }
        const user: ClienteSession = {
          usuario: (res.user.email || credentials.email).trim().toLowerCase(),
          nombre: res.user.fullName,
          empresa: res.user.client?.name,
          areas: res.user.areas ?? [],
          expiresAt: Date.now() + (res.expiresInSeconds ?? 900) * 1000
        };
        this.saveSession(user, res.accessToken);
        return user;
      })
    );
  }

  private saveSession(user: ClienteSession, token: string): void {
    this.storage?.setItem(this.USER_KEY, JSON.stringify(user));
    this.storage?.setItem(this.TOKEN_KEY, token);
    this.session$.next(user);
    this.scheduleExpiry(user.expiresAt);
  }

  logout(): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    this.storage?.removeItem(this.USER_KEY);
    this.storage?.removeItem(this.TOKEN_KEY);
    this.session$.next(null);
  }

  isLoggedIn(): boolean {
    return this.session$.value !== null;
  }

  getUsuario(): string {
    return this.session$.value?.usuario ?? '';
  }

  /** accessToken del CRM (JWT, 15 min). Null si no hay sesión. */
  getToken(): string | null {
    return this.storage?.getItem(this.TOKEN_KEY) ?? null;
  }
}
