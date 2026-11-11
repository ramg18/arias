import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  EnvioRespuesta,
  ResultadoArchivo,
  cedulaEnmascarada,
  nitConPuntos,
  nivelGeneral,
  pesos
} from '../../models/envio-respuesta';

@Component({
  selector: 'app-resultado-envio',
  templateUrl: './resultado-envio.component.html',
  styleUrls: ['./resultado-envio.component.css']
})
export class ResultadoEnvioComponent implements AfterViewInit {
  @Input() data!: EnvioRespuesta;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('closeBtn') closeBtn?: ElementRef<HTMLButtonElement>;

  readonly pesos = pesos;
  readonly nit = nitConPuntos;
  readonly cedula = cedulaEnmascarada;

  constructor(private translate: TranslateService) {}

  ngAfterViewInit(): void {
    this.closeBtn?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closed.emit();
  }

  get nivel(): 'success' | 'warning' | 'error' {
    return nivelGeneral(this.data);
  }

  get titleKey(): string {
    return { success: 'CLIENTES_RES.TITLE_OK', warning: 'CLIENTES_RES.TITLE_WARN', error: 'CLIENTES_RES.TITLE_ERR' }[this.nivel];
  }

  get chips(): Array<{ key: string; n: number; cls: string }> {
    const r = this.data.resumen;
    return [
      { key: 'CLIENTES_RES.CH_OK', n: r.ok, cls: 'ok' },
      { key: 'CLIENTES_RES.CH_REVIEW', n: r.porRevisar, cls: 'warn' },
      { key: 'CLIENTES_RES.CH_DUP', n: r.repetidas, cls: 'dup' },
      { key: 'CLIENTES_RES.CH_ERR', n: r.errores, cls: 'err' }
    ].filter(c => c.n > 0);
  }

  /** Los que tienen problema primero (y abiertos); luego los correctos. */
  get ordenados(): ResultadoArchivo[] {
    const peso = (e: string) => (e === 'error' ? 0 : e === 'por_revisar' ? 1 : e === 'repetida' ? 2 : 3);
    return [...this.data.resultados].sort((a, b) => peso(a.estado) - peso(b.estado));
  }

  /** Nómina: la respuesta trae empleado/periodo y no factura/comprobante. */
  esNomina(r: ResultadoArchivo): boolean {
    return !!(r.empleado || r.periodo || r.driveUrl) && !r.factura && !r.comprobante;
  }

  esContado(banco: string): boolean {
    return banco.trim().toUpperCase() === 'CONTADO';
  }

  /** null = no se puede comparar; 0 = coincide; otro = diferencia. */
  diferencia(r: ResultadoArchivo): number | null {
    const t = r.factura?.total;
    const v = r.comprobante?.valor;
    if (t === null || t === undefined || v === null || v === undefined) return null;
    return Math.round(v - t);
  }

  private mes(n: number): string {
    return this.translate.instant(`CLIENTES_RES.MES.${n}`);
  }

  /** 2026-11-09 → «9 nov 2026» */
  fecha(iso: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    return `${Number(m[3])} ${this.mes(Number(m[2])).slice(0, 3)} ${m[1]}`;
  }

  /** 2026-10 Q2 → «octubre 2026 · 2.ª quincena» */
  periodo(p: string): string {
    const m = /^(\d{4})-(\d{2})\s*Q([12])$/i.exec(p.trim());
    if (!m) return p;
    return this.translate.instant('CLIENTES_RES.QUINCENA', { m: this.mes(Number(m[2])), y: m[1], q: m[3] });
  }

  difTexto(d: number): string {
    return pesos(Math.abs(d));
  }

  trackByIndex = (i: number) => i;
}
