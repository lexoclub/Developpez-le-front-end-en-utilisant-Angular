import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { ChartData } from 'src/app/core/models/ChartData';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  // Options
  showLegend = true;
  gradient = false;
  doughnut = false;

  single: ChartData[] = []; // Data for the pie chart
  view: [number, number] = [700, 400]; // Size of the chart
  totalCountries: number = 0; // Variable to hold the total number of unique countries
  totalJOs: number = 0; // Variable to hold the total number of unique JOs

  

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(data => {
      if (data) {
        this.single = this.olympicService.prepareChartData(data); // Process data to prepare for chart
        this.totalCountries = this.olympicService.calculateTotalCountries(data); // Calculate total countries
        this.totalJOs = this.olympicService.calculateTotalJOs(data); // Calculate total JOs
        console.log(`Total Unique Countries: ${this.totalCountries}`); // Log total countries
        console.log(`Total Unique JOs: ${this.totalJOs}`); // Log total JOs
      }
    });
  }

  onSelect(event: any): void {
    const selectedCountry = event.name; // Get the selected country name
    this.router.navigate(['/details', selectedCountry]); // Navigate to the detail page
  }
}
