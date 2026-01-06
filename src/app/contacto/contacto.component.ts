import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactoService } from '../services/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  contactForm: FormGroup;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private contactoSvc: ContactoService){
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

  // Método para obtener mensajes de error
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Formato de email inválido';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato de celular inválido (10 dígitos)';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'nombre': 'Nombre',
      'email': 'Email',
      'celular': 'Celular',
      'mensaje': 'Mensaje'
    };
    return labels[fieldName] || fieldName;
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
      ),(error:any) =>{
        
          this.isLoading = false;
          this.showErrorAlert(error.message);
        
      };
      

    } else {
      this.markFormGroupTouched();
      this.showValidationAlert();
    }
  }

  

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  // Alertas con SweetAlert2
  private showSuccessAlert(): void {
    Swal.fire({
      title: '¡Éxito!',
      text: 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745'
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Intentar nuevamente',
      confirmButtonColor: '#dc3545'
    });
  }

  private showValidationAlert(): void {
    Swal.fire({
      title: 'Formulario incompleto',
      text: 'Por favor, completa todos los campos requeridos correctamente.',
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107'
    });
  }

}
