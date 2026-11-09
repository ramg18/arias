import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-dropzone',
  templateUrl: './file-dropzone.component.html',
  styleUrls: ['./file-dropzone.component.css']
})
export class FileDropzoneComponent {
  @Input() label = '';
  @Input() hint = '';
  /** Atributo accept del input (ej. ".xml" o "image/*"). */
  @Input() accept = '';
  /** Validación extra de tipo: regex sobre `file.type` o nombre. */
  @Input() typePattern: RegExp | null = null;
  @Input() maxMB = 5;
  @Input() file: File | null = null;
  @Input() invalid = false;
  /** false = campo opcional: sin asterisco y con etiqueta "(opcional)". */
  @Input() required = true;
  @Input() icon = 'fa-cloud-arrow-up';

  @Output() fileChange = new EventEmitter<File | null>();

  error = '';
  dragging = false;
  previewUrl: string | null = null;

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handle(input.files?.[0] ?? null);
    input.value = ''; // permite re-seleccionar el mismo archivo
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.handle(event.dataTransfer?.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  clear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.setFile(null);
  }

  private handle(file: File | null): void {
    this.error = '';
    if (!file) return;

    if (this.typePattern && !this.typePattern.test(file.type) && !this.typePattern.test(file.name)) {
      this.error = 'CLIENTES.ERR_TYPE';
      return;
    }
    if (file.size > this.maxMB * 1024 * 1024) {
      this.error = 'CLIENTES.ERR_SIZE';
      return;
    }
    this.setFile(file);
  }

  private setFile(file: File | null): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    if (file && file.type.startsWith('image/')) {
      this.previewUrl = URL.createObjectURL(file);
    }
    this.file = file;
    this.fileChange.emit(file);
  }

  /** Llamar tras reset del formulario padre: el padre pone [file]=null. */
  ngOnChanges(): void {
    if (!this.file && this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }
}
