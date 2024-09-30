import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Country } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  countryData!: Country | {
    "id": 0,
    "country": "",
    "participations": Participation[]
  }; // Variable to hold country data
  // chartData: { name: number; series: { name: string; value: number }[] }[] = []; // Data for the chart
  chartData: { name: string; series: { name: string; value: number }[] }[] = []; // Data for the chart
  numberOfEntries: number = 0; // Variable to hold the number of entries
  totalMedals: number = 0; // Variable to hold the total number of medals
  totalAthletes: number = 0;
  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const countryName = params.get('countryName');
      if (countryName) {
        this.loadCountryData(countryName);
        this.numberOfEntries = this.olympicService.getNumberOfEntriesByCountry(countryName); // Get number of entries
        this.totalMedals = this.olympicService.getTotalMedalsByCountry(countryName); // Get total medals
        this.totalAthletes = this.olympicService.getTotalAthletesByCountry(countryName);
      }
    });
  }

  loadCountryData(name: string): void {
    this.olympicService.getOlympics().subscribe(data => {
      this.countryData = data.find((country: { country: string; }) => country.country === name);
      if (this.countryData) {
        this.prepareChartData(this.countryData.participations);
      }
    });
  }

  // Prepare the chart data from participations
  prepareChartData(participations: Participation[]): void {
    // Initialize the chartData with the country name
    this.chartData = [{
      name: this.countryData?.country || 'Unknown', // Use the country name
      series: [] // Initialize an empty series array
    }];

    // Populate the series with participation data
    participations.forEach(participation => {
      this.chartData[0].series.push({
        name: participation.year.toString(), // Use the year as the name
        value: participation.medalsCount // Set the medals count as the value
      });
    });

    console.log(this.chartData);
  }

  // Method to navigate back to the home component
  goBack(): void {
    this.router.navigate(['/']);
  }
}