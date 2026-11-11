import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { EnvioRespuesta, nivelGeneral } from '../../models/envio-respuesta';
import { ClientesUploadService } from '../../services/clientes-upload.service';

@Component({
  selector: 'app-tab-comprobante',
  templateUrl: './tab-comprobante.component.html',
  styleUrls: ['../../clientes-forms.css']
})
export class TabComprobanteComponent {
  form: FormGroup = this.fb.group({
    numero_factura: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^\S(.*\S)?$/)]],
    imagen: [null as File | null, Validators.required]
  });
  loading = false;
  resultado: EnvioRespuesta | null = null;
  readonly imgPattern = /^image\//;

  constructor(
    private fb: FormBuilder,
    private upload: ClientesUploadService,
    private translate: TranslateService
  ) {}

  setFile(file: File | null): void {
    this.form.get('imagen')!.setValue(file);
    this.form.get('imagen')!.markAsTouched();
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { numero_factura, imagen } = this.form.value;
    this.upload.enviar('comprobante', { numero_factura, imagen }).subscribe({
      next: res => {
        this.loading = false;
        if (!res) {
          // Respuesta sin el formato esperado: mensaje genérico.
          this.form.reset({ numero_factura: '', imagen: null });
          Swal.fire({ icon: 'success', title: this.translate.instant('CLIENTES.OK'), confirmButtonText: 'Ok' });
          return;
        }
        this.resultado = res;
        // Si todo falló se conserva lo cargado para que pueda reintentar.
        if (nivelGeneral(res) !== 'error') this.form.reset({ numero_factura: '', imagen: null });
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: this.translate.instant('CLIENTES.ERR_SEND') });
      }
    });
  }
}
