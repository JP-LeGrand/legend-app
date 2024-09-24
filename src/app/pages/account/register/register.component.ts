import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(  private formBuilder: UntypedFormBuilder,
    private router: Router,
    private accountService: AccountService,
    private toastrService: ToastrService) { 
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.toastrService.clear();

    this.accountService.register(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.toastrService.success('Registration successful');
                this.router.navigate(['/login']);
            },
            error: error => {
                this.toastrService.error(error);
            }
        });
}

}
