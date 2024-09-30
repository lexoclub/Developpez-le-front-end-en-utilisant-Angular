import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ChartData } from '../models/ChartData';
import { Country } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  prepareChartData(data: Country[]): ChartData[] {
    return data.map(country => {
      const totalMedals = country.participations.reduce((sum: number, participation: Participation) => {
        return sum + participation.medalsCount;
      }, 0);
      return { name: country.country, value: totalMedals };
    });
  }

  calculateTotalCountries(data: Country[]): number {
    const countriesSet = new Set<string>();
    data.forEach(country => {
      countriesSet.add(country.country);
    });
    return countriesSet.size;
  }

  calculateTotalJOs(data: Country[]): number {
    const yearsSet = new Set<number>(); // Set to store unique years
    data.forEach(country => {
      country.participations.forEach((participation: Participation) => {
        yearsSet.add(participation.year); // Add year to the set
      });
    });
    return yearsSet.size; // Return the count of unique years
  }

  // New method to calculate the number of entries by country
  getNumberOfEntriesByCountry(countryName: string): number {
    const countries = this.olympics$.getValue(); // Get the current list of countries
    const country = countries.find((c: { country: string; }) => c.country === countryName); // Find the specific country
    return country ? country.participations.length : 0; // Return the number of entries (participations)
  }

  // Public method to get the total number of medals by country
  getTotalMedalsByCountry(countryName: string): number {
    return this.getTotalByCountry(countryName, 'medalsCount'); // Call the private method with medalsCount
  }

  // Public method to get the total number of athletes by country
  getTotalAthletesByCountry(countryName: string): number {
    return this.getTotalByCountry(countryName, 'athleteCount'); // Call the private method with athleteCount
  }

  // Private method to calculate totals by country for a given property
  private getTotalByCountry(countryName: string, property: 'medalsCount' | 'athleteCount'): number {
    const countries = this.olympics$.getValue(); // Get the current list of countries
    const country = countries.find((c: { country: string; }) => c.country === countryName); // Find the specific country

    if (country) {
      return country.participations.reduce((total: number, participation: { [x: string]: any; }) => {
        return total + participation[property]; // Sum based on the specified property
      }, 0); // Initialize sum to 0
    }
    return 0; // Return 0 if country is not found
  }
}
