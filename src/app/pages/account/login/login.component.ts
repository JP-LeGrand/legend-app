import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private accountService: AccountService,
    private toastrService: ToastrService) {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
   }

  ngOnInit(): void {
  }

  onSubmit() {
    this.toastrService.clear();

    this.accountService.login(this.form.value.userName, this.form.value.password)
        .pipe(first())
        .subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: error => {
                this.toastrService.error(error);
            }
        });
}

}
