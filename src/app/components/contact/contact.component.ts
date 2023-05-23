import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  brightTheme!: boolean;
  darkTheme!: boolean;

  ngOnInit(): void {
    if(localStorage.getItem('theme') === "bright") {
      this.brightTheme = true;
      this.darkTheme = false;
    } else if(localStorage.getItem('theme') === "dark") {
      this.darkTheme = true;
      this.brightTheme = false;
    }
  }
}