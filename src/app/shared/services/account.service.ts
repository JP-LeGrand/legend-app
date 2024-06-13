import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../classes/user';
import { environment } from 'src/environments/environment';
import { Address } from '../classes/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  private addressSubject: BehaviorSubject<Address>;
  public user: Observable<User>;
  public address: Observable<Address>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.addressSubject = new BehaviorSubject<Address>(JSON.parse(localStorage.getItem('address')));
    this.user = this.userSubject.asObservable();
    this.address = this.addressSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public get addressValue(): Address {
    return this.addressSubject.value;
  }

  login(username, password) {
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/pages/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  addAddress(address: Address) {
    address.userId = this.userValue.id;
    return this.http.post(`${environment.apiUrl}/address/add`, address);
  }

  getAllAddresses() {
    return this.http.get<Address[]>(`${environment.apiUrl}/address`);
}

getUserById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
}

getAddressById(id: string) {
  return this.http.get<Address>(`${environment.apiUrl}/address/${id}`);
}

updateUser(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
        .pipe(map(x => {
            // update stored user if the logged in user updated their own record
            if (id == this.userValue.id) {
                // update local storage
                const user = { ...this.userValue, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                this.userSubject.next(user);
            }
            return x;
        }));
}

updateAddress(id, params) {
  params.userId = this.userValue.id;
  return this.http.put(`${environment.apiUrl}/address/${id}`, params)
      .pipe(map(x => {
          // update stored address if the logged in user updated their own record
          if (id == this.addressValue.addressId) {
              // update local storage
              const address = { ...this.addressValue, ...params };
              localStorage.setItem('address', JSON.stringify(address));

              // publish updated address to subscribers
              this.addressSubject.next(address);
          }
          return x;
      }));
}

deleteAddress(id: string) {
  return this.http.delete(`${environment.apiUrl}/address/${id}`);
}

}
