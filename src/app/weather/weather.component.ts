import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../_services/api-service.service';
interface WeatherProps {
  cityName: string;
  weatherReport: [];
  temparature: any;
}
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  errorMessage = '';
  weatherForm!: FormGroup;
  weatherData: WeatherProps[] = [];
  isEdit = false;
  selectedData: WeatherProps | undefined;
  selectedIndex: number | undefined;
  constructor(
    private weatherService: ApiServiceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.weatherForm = this.formBuilder.group({
      cityName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  getWeatherInfo() {
    this.weatherService.getWeatherDataByCityName(this.weatherForm.controls.cityName.value)
      .subscribe(
        (data: any) => {
          console.log(data)
          if (data && data.weather) {
            if (this.selectedData && this.weatherData.includes(this.selectedData)) {
              const index = this.weatherData.findIndex(item => item.cityName === this.selectedData?.cityName);
              this.weatherData[index] = { cityName: data.name, weatherReport: data.weather, temparature: data.main.temp.toFixed(2) }
              this.isEdit = false;
            } else {
              this.weatherData.push({ cityName: data.name, weatherReport: data.weather, temparature: data.main.temp.toFixed(2) })
            }
          }
          this.weatherForm.reset();
        }, (err: any) => {
          console.log(err);
          if (err && err.error) {
            this.errorMessage = err.error.message;
            // Hiding error after 5 seconds.
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000)
            this.weatherForm.reset();
          }
        }
      )
  }
  getClass(weatherData: WeatherProps) {
    let className = ''
    weatherData.weatherReport.map((item: any) => {
      if (item.main === 'Clear') {
        className = 'bi bi-cloud icon'
      }
      if (item.main === 'Clouds') {
        className = 'bi bi-clouds icon'
      }
    });
    return className
  }
  updateWeatherInfo(item?: WeatherProps) {
    this.selectedData = item;
    this.getWeatherInfo();
  }
  showEdit(item: WeatherProps) {
    this.isEdit = true;
    this.weatherForm.controls.cityName.setValue(item.cityName)
  }
  deleteReport(index: number) {
    this.weatherData.splice(index, 1)
  }
}
