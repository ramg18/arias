import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ClientesAuthService } from '../../services/clientes-auth.service';

@Component({
  selector: 'app-login-clientes',
  templateUrl: './login-clientes.component.html',
  styleUrls: ['../../clientes-forms.css']
})
export class LoginClientesComponent {
  @Output() loggedIn = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: ClientesAuthService,
    private translate: TranslateService
  ) {}

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.loggedIn.emit();
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: this.translate.instant('CLIENTES.ERR_LOGIN') });
      }
    });
  }
}
