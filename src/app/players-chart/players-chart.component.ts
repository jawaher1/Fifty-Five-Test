import { PlayersDataService } from '../@core/services/players-data/players-data.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ValueAxis,
  CircleBullet,
  XYCursor,
  XYChart,
  LineSeries,
  DateAxis
} from '@amcharts/amcharts4/charts';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { color, create, useTheme } from '@amcharts/amcharts4/core';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.options.autoSetClassName = true;
useTheme(am4themes_animated);
@Component({
  selector: 'app-players-chart',
  templateUrl: './players-chart.component.html',
  styleUrls: ['./players-chart.component.scss']
})
export class PlayersChartComponent implements OnInit {
  playersData: any;
  keysList: any;
  chart: any;
  chartData: any = []

  constructor(
    private playersService: PlayersDataService
  ) { }

  ngOnInit() {
    this.chart = create("chart-div", XYChart);
    this.getData(() => {
      this.prepareChartData()
      console.log(this.chartData)
      this.createChartOptions(this.chartData);

    })
  }

  getData(callback: Function) {
    this.playersService.getPlayersData().subscribe(
      (data) => {
        this.playersData = data;
        console.log(data)
        callback(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  formatDate(date: string, index: number, list: any[]) {
    if (date == null) {
      list[index] = NaN
    } else {
      list[index] = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8)
    }
  }
  CleanNullValues(element: number, index: number, list: any[]) {
    if (element == null) {
      list[index] = NaN
    }
  }

  prepareChartData() {
    var keysList = (this.playersData["data"]["DAILY"].dates)
    var playerOneValuesList = (this.playersData["data"]["DAILY"].dataByMember).players["john"].points
    var playerTwoValuesList = (this.playersData["data"]["DAILY"].dataByMember).players["larry"].points
    //cleaning null Values
    keysList.forEach(this.formatDate)
    playerOneValuesList.filter(this.CleanNullValues);
    playerTwoValuesList.filter(this.CleanNullValues);
    console.log(keysList)
    console.log(playerOneValuesList)
    console.log(playerTwoValuesList)

    this.chartData = []
    for (let i = 0; i < keysList.length; i++) {
      this.chartData.push({
        date: keysList[i],
        value: playerOneValuesList[i],
        value2: playerTwoValuesList[i]
      })
    }
  }

  createSeries(field: any, date: string, name: string) {
    var series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = date;
    series.name = name;
    //this.scrollbarSeries = series
    series.fillOpacity = 0.1;
    //  series.strokeWidth = 2;
    series.tooltipText = '{dateX.formatDate("d MMM, yyyy")} | {valueY}'
    series.adapter.add('tooltipText', (text: string, target: any, key: any) => {
      //retrieve point's data
      const data = target.tooltipDataItem.dataContext;
      return text;
    });
    series.connect = true
    return series;
  }


  createChartOptions(data: any) {
    // Add data
    this.chart.data = data
    // Create axes
    var dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    dateAxis.dataFields.category = "date";
    dateAxis.gridAlpha = 0;
    dateAxis.autoGridCount = true;
    dateAxis.minHorizontalGap = 100;
    dateAxis.gridPosition = "start";
    dateAxis.equalSpacing = false;
    dateAxis.parseDates = false;
    dateAxis.minPeriod = "DD";
    dateAxis.startOnAxis = true;
    dateAxis.axisColor = "#dcdcdc";
    dateAxis.axisThickness = 1;
    dateAxis.showLastLabel = true;
    dateAxis.renderer.minGridDistance = 100;
    valueAxis.renderer.minGridDistance = 60;
    dateAxis.renderer.grid.template.stroke = "#9FB2C3";
    valueAxis.renderer.grid.template.stroke = "#9FB2C3";
    valueAxis.renderer.grid.template.strokeWidth = 1;
    var series1 = this.createSeries("value", "date", "John");
    var series2 = this.createSeries("value2", "date", "Larry");
    // Create series

    this.chart.colors.list = [am4core.color('#070919')]
    this.chart.dateFormatter.dateFormat = "MMM dd"

    this.chart.cursor = new XYCursor();
    this.chart.cursor.xAxis = dateAxis
    this.chart.cursor.selection.fill = am4core.color("#c7bfbf");

    //the reset zoom button
    this.chart.zoomOutButton.disabled = true;

    //zoom when hitting xaxis
    // Set up drill-down
    dateAxis.renderer.labels.template.events.on("hit", (ev: any) => {
      var start = ev.target.dataItem.date
      var end = new Date(start);
      end.setDate(end.getDate() + 5);
      if (start.length == undefined) {
        end = new Date(start);
      }
      dateAxis.zoomToDates(start, end);
    })
    this.chart.scrollbarX = new am4charts.XYChartScrollbar();
    this.chart.scrollbarX.series.push(series1);
    this.chart.scrollbarX.series.push(series2);
    this.chart.scrollbarX.scrollbarChart.series.getIndex(0).xAxis.startLocation = 0.5;
    this.chart.scrollbarX.scrollbarChart.series.getIndex(0).xAxis.endLocation = 0.5;
    this.chart.scrollbarX.marginBottom = 0;
    this.chart.scrollbarX.parent = this.chart.bottomAxesContainer;

    let scrollAxis = this.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0);
    scrollAxis.renderer.labels.template.disabled = true;
    scrollAxis.renderer.grid.template.disabled = true;

    this.customizeGrip(this.chart.scrollbarX.startGrip);
    this.customizeGrip(this.chart.scrollbarX.endGrip);

    let scrollSeries1 = this.chart.scrollbarX.series.getIndex(0);
    scrollSeries1.filters.clear();
    //scrollSeries1.fillOpacity = 0;
    //scrollSeries1.fillOpacity = 0
    //scrollSeries1.strokeWidth = 0
    this.chart.scrollbarX.series.stroke = "#0000ffff"

    // Pre-zoom the chart
    /*     this.chart.events.on("ready", () => {
          dateAxis.zoomToDates(
            this.calcTime((this.keyslist[this.keyslist.length - 7]).toString().slice(0, 10), this.offset).toString().slice(4,10),
            this.calcTime((this.keyslist[this.keyslist.length - 1]).toString().slice(0, 10), this.offset).toString().slice(4,10)
          ) 
        }); */
  }

  customizeGrip(grip: any) {
    grip.icon.disabled = true;
    grip.background.disabled = true;
    var img = grip.createChild(am4core.Rectangle);
    img.width = 8;
    img.height = 8;
    img.fill = am4core.color("#999");
    img.rotation = 45;
    img.align = "center";
    img.valign = "middle";
    let line = grip.createChild(am4core.Rectangle);
    line.height = 50;
    line.width = 2;
    line.fill = am4core.color("#999");
    line.align = "center";
    line.valign = "middle"
  }
}
