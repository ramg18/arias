import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ClientesUploadService } from '../../services/clientes-upload.service';

const atLeastOne = (c: AbstractControl): ValidationErrors | null =>
  Array.isArray(c.value) && c.value.length > 0 ? null : { required: true };

@Component({
  selector: 'app-tab-facturas',
  templateUrl: './tab-facturas.component.html',
  styleUrls: ['../../clientes-forms.css']
})
export class TabFacturasComponent {
  form: FormGroup = this.fb.group({
    xml: [[] as File[], atLeastOne],
    imagen: [[] as File[]] // opcional
  });
  loading = false;
  readonly xmlPattern = /xml/i;
  readonly imgPattern = /^image\//;
  /** Máximo de archivos por campo y peso total por envío (el servidor corta en 60 MB). */
  readonly maxFiles = 10;
  readonly maxTotalMB = 50;

  constructor(
    private fb: FormBuilder,
    private upload: ClientesUploadService,
    private translate: TranslateService
  ) {}

  get totalTooBig(): boolean {
    const all: File[] = [...(this.form.value.xml ?? []), ...(this.form.value.imagen ?? [])];
    return all.reduce((s, f) => s + f.size, 0) > this.maxTotalMB * 1024 * 1024;
  }

  setFiles(control: 'xml' | 'imagen', files: File[]): void {
    this.form.get(control)!.setValue([...files]);
    this.form.get(control)!.markAsTouched();
  }

  submit(): void {
    if (this.form.invalid || this.loading || this.totalTooBig) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { xml, imagen } = this.form.value as { xml: File[]; imagen: File[] };
    // Los comprobantes de pago son opcionales: solo se envían los que el cliente adjuntó.
    // Cada campo se repite una vez por archivo (xml, xml, … / imagen, imagen, …).
    const campos: Record<string, File[]> = { xml };
    if (imagen.length) campos['imagen'] = imagen;
    this.upload.enviar('factura', campos).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset({ xml: [], imagen: [] });
        Swal.fire({ icon: 'success', title: this.translate.instant('CLIENTES.OK'), confirmButtonText: 'Ok' });
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: this.translate.instant('CLIENTES.ERR_SEND') });
      }
    });
  }
}
