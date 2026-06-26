import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactoService } from '../services/contacto.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactoSvc: ContactoService,
    private translate: TranslateService
  ){
    this.contactForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} ${this.translate.instant('CONTACT.ERR_REQUIRED')}`;
      }
      if (field.errors['email']) {
        return this.translate.instant('CONTACT.ERR_EMAIL');
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} ${this.translate.instant('CONTACT.ERR_MIN', { min: field.errors['minlength'].requiredLength })}`;
      }
      if (field.errors['pattern']) {
        return this.translate.instant('CONTACT.ERR_PHONE');
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const keys: { [key: string]: string } = {
      'nombre': 'CONTACT.FORM_NAME',
      'email': 'CONTACT.FORM_EMAIL',
      'celular': 'CONTACT.FORM_PHONE',
      'mensaje': 'CONTACT.FORM_MESSAGE'
    };
    return this.translate.instant(keys[fieldName] || fieldName);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.contactoSvc.enviarLead(this.contactForm.value).subscribe(
        (response:any)=>{
          this.isLoading = false;
          this.showSuccessAlert();
          this.contactForm.reset();
        }
      ),(error:any) => {
          this.isLoading = false;
          this.showErrorAlert(error.message);
      };
    } else {
      this.markFormGroupTouched();
      this.showValidationAlert();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessAlert(): void {
    this.translate.get(['CONTACT.SUCCESS_TITLE','CONTACT.SUCCESS_TEXT','CONTACT.SUCCESS_BTN']).subscribe(t => {
      Swal.fire({
        title: t['CONTACT.SUCCESS_TITLE'],
        text: t['CONTACT.SUCCESS_TEXT'],
        icon: 'success',
        confirmButtonText: t['CONTACT.SUCCESS_BTN'],
        confirmButtonColor: '#28a745'
      });
    });
  }

  private showErrorAlert(message: string): void {
    this.translate.get('CONTACT.ERROR_BTN').subscribe(btn => {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: btn,
        confirmButtonColor: '#dc3545'
      });
    });
  }

  private showValidationAlert(): void {
    this.translate.get(['CONTACT.VALIDATION_TITLE','CONTACT.VALIDATION_TEXT','CONTACT.VALIDATION_BTN']).subscribe(t => {
      Swal.fire({
        title: t['CONTACT.VALIDATION_TITLE'],
        text: t['CONTACT.VALIDATION_TEXT'],
        icon: 'warning',
        confirmButtonText: t['CONTACT.VALIDATION_BTN'],
        confirmButtonColor: '#ffc107'
      });
    });
  }
}
