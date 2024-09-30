import { Component, OnInit } from '@angular/core';
import { take, reduce } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { ChartData } from './core/models/ChartData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  
  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}