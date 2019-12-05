import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { formatDate } from '@angular/common';
import { AlertController } from '@ionic/angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Timestamp } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {
  collapseCard = true;

  event = {
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    inprogJob: false,
    compJob: false,
    allDay: false
  };

  minDate = new Date().toISOString();

  eventSource = [];
  viewTitle = '';
  viewDesc = '';
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;

  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private db: AngularFirestore) { }

  ngOnInit() {
    this.resetEvent();
  }

  // Change Month/Week/Date
  nextBut() {
    // tslint:disable-next-line: prefer-const
    let swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  backBut() {
    // tslint:disable-next-line: prefer-const
    let swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  changeView(mode) {
    this.calendar.mode = mode;
  }

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      description: this.event.description,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      inprogJob: this.event.inprogJob,
      compJob: this.event.compJob
    };

    if (eventCopy.allDay) {
      const start = eventCopy.startTime;
      const end = eventCopy.startTime;
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    this.db.collection(`events`).add(eventCopy);
    this.eventSource.push(eventCopy);

    this.myCal.loadEvents();
    this.resetEvent();
  }

  resetEvent() {
    this.event = {
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      inprogJob: false,
      compJob: false,
      allDay: false
    }
  };

  async onEventSelected(event) {
    let start = formatDate(this.event.startTime, 'medium', this.locale);
    let end = formatDate(this.event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: this.event.title,
      subHeader: this.event.description,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: [
        {
          text: 'Back',
          handler: data => {
            console.log('Back Clicked');
          }
        }
      ]
    });

    alert.present();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onDescChanged(description) {
    this.viewDesc = description;
  }

  onTimeSelected(ev) {
    let selected = ev.selectedTime;
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  removeEvent(id: int) {
    this.eventSource = this.eventSource.filter(item => item.id !== id);
  }

}
