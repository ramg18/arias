import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ClientesUploadService } from '../../services/clientes-upload.service';

@Component({
  selector: 'app-tab-facturas',
  templateUrl: './tab-facturas.component.html',
  styleUrls: ['../../clientes-forms.css']
})
export class TabFacturasComponent {
  form: FormGroup = this.fb.group({
    xml: [null as File | null, Validators.required],
    imagen: [null as File | null] // opcional
  });
  loading = false;
  readonly xmlPattern = /xml/i;
  readonly imgPattern = /^image\//;

  constructor(
    private fb: FormBuilder,
    private upload: ClientesUploadService,
    private translate: TranslateService
  ) {}

  setFile(control: 'xml' | 'imagen', file: File | null): void {
    this.form.get(control)!.setValue(file);
    this.form.get(control)!.markAsTouched();
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { xml, imagen } = this.form.value;
    // El comprobante de pago es opcional: solo se envía si el cliente lo adjuntó.
    const campos: Record<string, File> = { xml };
    if (imagen) campos['imagen'] = imagen;
    this.upload.enviar('factura', campos).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        Swal.fire({ icon: 'success', title: this.translate.instant('CLIENTES.OK'), confirmButtonText: 'Ok' });
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: this.translate.instant('CLIENTES.ERR_SEND') });
      }
    });
  }
}
