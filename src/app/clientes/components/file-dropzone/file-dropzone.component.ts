import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

interface DzItem {
  file: File;
  preview: string | null;
}

@Component({
  selector: 'app-file-dropzone',
  templateUrl: './file-dropzone.component.html',
  styleUrls: ['./file-dropzone.component.css']
})
export class FileDropzoneComponent implements OnChanges {
  @Input() label = '';
  @Input() hint = '';
  /** Atributo accept del input (ej. ".xml" o "image/*"). */
  @Input() accept = '';
  /** Validación extra de tipo: regex sobre `file.type` o nombre. */
  @Input() typePattern: RegExp | null = null;
  @Input() maxMB = 5;
  /** Modo de un solo archivo. */
  @Input() file: File | null = null;
  @Input() invalid = false;
  /** false = campo opcional: sin asterisco y con etiqueta "(opcional)". */
  @Input() required = true;
  @Input() icon = 'fa-cloud-arrow-up';

  /** Modo de varios archivos: `files` es la lista actual (el padre la pone en [] para reiniciar). */
  @Input() multiple = false;
  @Input() files: File[] = [];
  @Input() maxFiles = 10;

  @Output() fileChange = new EventEmitter<File | null>();
  @Output() filesChange = new EventEmitter<File[]>();

  error = '';
  errorParams: Record<string, number> = {};
  dragging = false;
  previewUrl: string | null = null;
  items: DzItem[] = [];

  get hasFiles(): boolean {
    return this.multiple ? this.items.length > 0 : !!this.file;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handle(Array.from(input.files ?? []));
    input.value = ''; // permite re-seleccionar el mismo archivo
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.handle(Array.from(event.dataTransfer?.files ?? []));
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

  removeAt(index: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const [removed] = this.items.splice(index, 1);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    this.emitItems();
  }

  private validate(file: File): string {
    if (this.typePattern && !this.typePattern.test(file.type) && !this.typePattern.test(file.name)) {
      return 'CLIENTES.ERR_TYPE';
    }
    if (file.size > this.maxMB * 1024 * 1024) return 'CLIENTES.ERR_SIZE';
    return '';
  }

  private handle(picked: File[]): void {
    this.error = '';
    this.errorParams = { max: this.maxMB, count: this.maxFiles };
    if (picked.length === 0) return;

    if (!this.multiple) {
      const err = this.validate(picked[0]);
      if (err) {
        this.error = err;
        return;
      }
      this.setFile(picked[0]);
      return;
    }

    // Varios: se agregan los válidos; si alguno falla se avisa pero los demás entran.
    for (const f of picked) {
      const err = this.validate(f);
      if (err) {
        this.error = err;
        continue;
      }
      if (this.items.some(i => i.file.name === f.name && i.file.size === f.size && i.file.lastModified === f.lastModified)) {
        continue; // ya estaba en la lista
      }
      if (this.items.length >= this.maxFiles) {
        this.error = 'CLIENTES.ERR_COUNT';
        break;
      }
      this.items.push({ file: f, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null });
    }
    this.emitItems();
  }

  private emitItems(): void {
    this.files = this.items.map(i => i.file);
    this.filesChange.emit(this.files);
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

  /** Tras reiniciar el formulario el padre pone [file]=null o [files]=[]: se liberan las vistas previas. */
  ngOnChanges(): void {
    if (!this.multiple && !this.file && this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    if (this.multiple && this.files.length === 0 && this.items.length > 0) {
      this.items.forEach(i => i.preview && URL.revokeObjectURL(i.preview));
      this.items = [];
    }
  }
}
