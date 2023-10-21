import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: UntypedFormGroup;
  
  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private accountService: AccountService,
    private toastrService: ToastrService) {
    this.form = this.formBuilder.group({
      streetAddress: ['', [Validators.required]],
      complexBuilding: [''],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      suburb: [''],
      postalCode: ['', [Validators.required]]
  });
   }

  ngOnInit(): void {
  }

  onSubmit() {
    this.toastrService.clear();

    this.accountService.addAddress(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.toastrService.success('Address added successful');
                this.router.navigate(['/pages/dashnoard']);
            },
            error: error => {
                this.toastrService.error(error);
            }
        });
}

}
