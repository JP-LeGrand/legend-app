import { Component, OnInit } from '@angular/core';
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

  constructor(private accountService: AccountService) {
      this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout() {
    this.accountService.logout();
}

}
