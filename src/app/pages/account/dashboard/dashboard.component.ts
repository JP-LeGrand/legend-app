import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Address } from 'src/app/shared/classes/address';
import { User } from 'src/app/shared/classes/user';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openDashboard: boolean = false;

  user: User;
  addresses: Address[];

  constructor(private accountService: AccountService) {
      this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.accountService.getAllAddresses()
    .pipe(first())
    .subscribe(addresses => this.addresses = addresses);
  }

  deleteAddress(id: string) {
    this.accountService.deleteAddress(id)
        .pipe(first())
        .subscribe(() => this.addresses = this.addresses.filter(x => x.addressId !== id));
}


  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout() {
    this.accountService.logout();
}

}
