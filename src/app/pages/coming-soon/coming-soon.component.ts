import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent {
  date: any;
  now: any;
  targetDate: any = new Date(2023, 10, 30);
  targetTime: any = this.targetDate.getTime();
  difference: number;
  months: Array<string> = ["January", "February", "March", "April",
  "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Template literals is ideal for this scenario
  currentTime: any = this.months[this.targetDate.getMonth()] +
  ' ' + this.targetDate.getDate() + ', ' + this.targetDate.getFullYear();
  
  @ViewChild("days", { static: true }) days: ElementRef;
  @ViewChild("hours", { static: true }) hours: ElementRef;
  @ViewChild("minutes", { static: true }) minutes: ElementRef;
  @ViewChild("seconds", { static: true }) seconds: ElementRef;
  
  ngAfterViewInit() {
    setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      this.difference = this.difference / (1000 * 60 * 60 * 24);
      !isNaN(this.days.nativeElement.innerText)
        ? (this.days.nativeElement.innerText = Math.floor(this.difference))
        : (this.days.nativeElement.innerHTML = "<img src='https://i.gifer.com/VAyR.gif' />");
      }, 1000);
  }
  
  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = Math.floor(this.difference);
    this.hours.nativeElement.innerText = 23 - this.date.getHours();
    this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
    this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
  }

}
