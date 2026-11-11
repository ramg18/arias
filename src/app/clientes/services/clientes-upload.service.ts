import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { EnvioRespuesta, normalizar } from '../models/envio-respuesta';
import { environment } from '../../../environments/environment';
import { ClientesAuthService } from './clientes-auth.service';

export type TipoCarga = 'factura' | 'comprobante' | 'nomina';

@Injectable({ providedIn: 'root' })
export class ClientesUploadService {
  // HttpBackend evita el AuthInterceptor: aquí se envía el token del CLIENTE, no el de admin.
  private http: HttpClient;

  constructor(handler: HttpBackend, private auth: ClientesAuthService) {
    this.http = new HttpClient(handler);
  }

  /**
   * Envía multipart/form-data a /api/clientes/upload (proxy propio → webhook de n8n)
   * con `tipo`, `usuario` y los campos dados. Autentica con el accessToken del CRM.
   */
  enviar(tipo: TipoCarga, campos: Record<string, string | File | File[]>): Observable<EnvioRespuesta | null> {
    const token = this.auth.getToken();
    if (!token) {
      this.auth.logout();
      return throwError(() => new Error('Sesión expirada'));
    }

    const body = new FormData();
    body.append('tipo', tipo);
    body.append('usuario', this.auth.getUsuario());
    // Una lista de archivos repite el mismo nombre de campo una vez por archivo.
    Object.entries(campos).forEach(([k, v]) => (Array.isArray(v) ? v.forEach(f => body.append(k, f)) : body.append(k, v)));

    return this.http
      .post(environment.clientes.uploadUrl, body, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
      })
      .pipe(
        // El proxy devuelve {ok, data}; `data` es lo que respondió n8n (null si no tiene la forma esperada).
        map(res => normalizar((res as { data?: unknown } | null)?.data)),
        catchError(err => {
          // Token vencido o inválido: volver al login.
          if (err?.status === 401) this.auth.logout();
          return throwError(() => err);
        })
      );
  }
}
