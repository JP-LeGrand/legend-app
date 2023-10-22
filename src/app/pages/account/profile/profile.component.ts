import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  isAddMode: boolean;
  id: string;

  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params.id ? params.id : null;
    })
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      streetAddress: ['', [Validators.required]],
      complexBuilding: [''],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      suburb: [''],
      postalCode: ['', [Validators.required]]
    });

    if (!this.isAddMode) {
      this.accountService.getAddressById(this.id)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x));
    }
  }

  onSubmit() {
    this.toastrService.clear();

    if (this.isAddMode) {
      this.addAddress();
    } else {
      this.updateAddress();
    }
  }

  private addAddress() {
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

  private updateAddress() {
    this.accountService.updateAddress(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastrService.success('Address updated successful');
          this.router.navigate(['/pages/dashnoard']);
        },
        error: error => {
          this.toastrService.error(error);
        }
      });
  }
}
