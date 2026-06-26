import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PublicarService } from '../../services/publicar.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.css']
})
export class PublicarComponent implements OnInit {
  isLoggedIn: boolean = false;
  loginForm!: FormGroup;
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  currentUser: string = '';
  isChangingPass: boolean = false;
  changePassForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private publicarSvc: PublicarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkSession();
    this.initForms();
  }

  private checkSession() {
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.currentUser = this.authService.getCurrentUser()?.email || '';
    }
  }

  initForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.uploadForm = this.fb.group({
      tipo: ['tributario', [Validators.required]],
      archivo: [null, [Validators.required]]
    });

    this.changePassForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.isLoggedIn = true;
          this.currentUser = res.user.email;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('ADMIN.LOGIN_BTN'),
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.translate.instant('ADMIN.ERROR_LOGIN')
          });
        }
      });
    }
  }

  onChangePassword() {
    // Note: The new Auth API may not support this endpoint directly yet
    Swal.fire({
      icon: 'info',
      title: 'Funcionalidad en desarrollo',
      text: 'Esta opción no está disponible temporalmente con el nuevo sistema de autenticación.'
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.uploadForm.patchValue({
        archivo: this.selectedFile
      });
    }
  }

  onSubmitUpload() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isLoading = true;
      const type = this.uploadForm.get('tipo')?.value;
      
      // Image URLs provided (Cloudinary)
      let imageUrl = '';
      switch (type) {
        case 'tributario':
          imageUrl = 'https://res.cloudinary.com/dgjz2l5ah/image/upload/v1774884187/Tributario_wlfrgr.jpg';
          break;
        case 'juridico':
          imageUrl = 'https://res.cloudinary.com/dgjz2l5ah/image/upload/v1774884187/Jur_C3_ADdico_n85byn.jpg';
          break;
        case 'contable':
          imageUrl = 'https://res.cloudinary.com/dgjz2l5ah/image/upload/v1775494604/Contable_j65zsi.jpg';
          break;
      }

      this.publicarSvc.subirPublicacion(type, this.selectedFile, imageUrl, this.currentUser).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('ADMIN.SUCCESS'),
            confirmButtonText: 'Ok'
          });
          this.uploadForm.reset({ tipo: 'tributario' });
          this.selectedFile = null;
        },
        error: (err: any) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al subir la publicación.'
          });
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.loginForm.reset();
  }
}
