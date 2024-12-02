import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {PieChart} from "@amcharts/amcharts4/charts";
import {LeaseService} from "../../../../../service/lease.service";

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.css']
})
export class CustomReportComponent implements OnInit {
  startDate: any;
  endDate: any;
  reportData: any;
  reportDataLoaded = false;


  constructor(private leaseService: LeaseService) {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.startDate = startOfMonth.toISOString().split('T')[0]; // 'yyyy-MM-dd' format
    this.endDate = endOfMonth.toISOString().split('T')[0]; // 'yyyy-MM-dd' format
  }

  ngOnInit(): void {
    this.getIncomeReportData();
  }

  getIncomeReportData() {
    this.leaseService.getIncomeReportData(this.startDate, this.endDate)
      .subscribe((data: any) => {
        this.reportData = data;
        console.log(this.reportData)
        this.drawChart();
        this.drawCapitalChart();
        this.reportDataLoaded = true;
      })
  }

  drawChart() {

    let chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.data = [{
      "field": "Total Sale",
      "value": this.reportData.totalSaleActual
    }, {
      "field": "Total Interest",
      "value": this.reportData.totalInterestToCollect
    }];

    this.createPieChart(chart);
  }

  drawCapitalChart() {

    let chart = am4core.create("capitalChart", am4charts.PieChart);
    chart.data = [{
      "field": "Total Sale",
      "value": this.reportData.totalSaleCapital
    }, {
      "field": "Total Interest",
      "value": this.reportData.totalInterest
    },
      {
        "field": "Total Collection",
        "value": this.reportData.totalCollection
      }
    ];
    this.createPieChart(chart);
  }


  createPieChart(chart: PieChart) {
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "field";

    // Let's cut a hole in our Pie chart the size of 40% the radius
    chart.innerRadius = am4core.percent(40);

// Disable ticks and labels
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

// Disable tooltips
    pieSeries.slices.template.tooltipText = "";

// Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';
    chart.legend.valign = 'bottom';
    chart.legend.useDefaultMarker = true;
    chart.legend.fontSize = 10;

    const markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;
  }



}
