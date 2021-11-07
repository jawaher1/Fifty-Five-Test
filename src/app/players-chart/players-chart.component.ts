import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  XYCursor,
  XYChart
} from '@amcharts/amcharts4/charts';
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { create, useTheme } from '@amcharts/amcharts4/core';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.options.autoSetClassName = true;
useTheme(am4themes_animated);
@Component({
  selector: 'app-players-chart',
  templateUrl: './players-chart.component.html',
  styleUrls: ['./players-chart.component.scss']
})
export class PlayersChartComponent implements OnChanges {
  @Input() keysList: string[];
  @Input() valuesList: string[];
  @Input() selectedPlayerIndex: number = 0;
  @Input() playersList: string[]
  chart: any;
  chartData: any = []

  constructor(
  ) { }

  ngOnChanges() {
    this.chart = create("chart-div", XYChart);
    setTimeout(() => {
      if (this.keysList) {
        this.prepareChartData()
        this.createChartOptions(this.chartData);
      }
    })
  }

  prepareChartData() {
    this.chartData = []
    if (this.selectedPlayerIndex != 0) {
      for (let i = 0; i < this.keysList.length; i++) {
        this.chartData.push({
          date: this.keysList[i],
          value: this.valuesList[this.selectedPlayerIndex - 1][i]
        })
      }
    }
    else {
      for (let i = 0; i < this.keysList.length; i++) {
        var dataItem: any = {}
        for (let j = 0; j < this.valuesList.length; j++) {
          dataItem["date"] = this.keysList[i]
          dataItem["value" + j.toString()] = this.valuesList[j][i]
        }
        this.chartData.push(dataItem)
      }
    }
  }

  createSeries(field: any, date: string, name: string) {
    var series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = date;
    series.name = name;
    series.fillOpacity = 0.1;
    series.columns.template.width = am4core.percent(13);
    series.columns.template.fillOpacity = 0.5;
    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    series.columns.template.tooltipHTML = '<b>{dateX.formatDate("d MMM, yyyy")} | {valueY}</b><br> <a href="http://cdn.55labs.com/demo/api.json">More info</a>'
    series.adapter.add('tooltipText', (text: string, target: any, key: any) => {
      //retrieve point's data
      const data = target.tooltipDataItem.dataContext;
      return text;
    });
    series.tooltip.getFillFromObject = false;
    series.tooltip.getStrokeFromObject = true
    series.tooltip.label.background.fill = am4core.color("#fff");
    series.tooltip.label.fill = am4core.color("#bebebe");
    series.tooltip.label.fontSize = 12;
    series.tooltip.pointerOrientation = "down"
    //interactivity with tooltip
    series.tooltip.label.interactionsEnabled = true;
    series.tooltip.keepTargetHover = true;
    return series;
  }



  createChartOptions(data: any) {
    // Add data
    this.chart.data = data
    // Create axes
    var dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    dateAxis.tooltipDateFormat = "yyyy-MM-dd";
    //dateAxis.groupData = true;
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
    // Grid Customization
    dateAxis.renderer.minGridDistance = 100;
    valueAxis.renderer.minGridDistance = 60;
    dateAxis.renderer.grid.template.stroke = "#9FB2C3";
    valueAxis.renderer.grid.template.stroke = "#9FB2C3";
    valueAxis.renderer.grid.template.strokeWidth = 1;
    //formatting yaxis Numbers
    valueAxis.numberFormatter.numberFormat = "#,###,###";
    //font
    dateAxis.renderer.labels.template.fontSize = 12;
    dateAxis.renderer.labels.template.fontFamily = "Quicksand";
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontFamily = "Quicksand";
    // Create series
    this.chart.cursor = new XYCursor();
    this.chart.cursor.xAxis = dateAxis
    this.chart.cursor.selection.fill = am4core.color("#c7bfbf");
    //the reset zoom button
    this.chart.zoomOutButton.disabled = true;
    //zoom when hitting xaxis
    dateAxis.renderer.labels.template.events.on("hit", (ev: any) => {
      var start = ev.target.dataItem.date
      var end = new Date(start);
      end.setDate(end.getDate() + 5);
      if (start.length == undefined) {
        end = new Date(start);
      }
      dateAxis.zoomToDates(start, end);
    })
    // Pre-zoom the chart
    this.chart.events.on("datavalidated", () => {
      if (this.keysList) {
        dateAxis.zoomToDates(
          (this.keysList[this.keysList.length - 10]).toString().slice(0, 10),
          (this.keysList[this.keysList.length - 1]).toString().slice(0, 10)
        )
      }
    });
    //Create scrollbar
    this.chart.scrollbarX = new am4charts.XYChartScrollbar();
    //Create Series
    if (this.selectedPlayerIndex == 0) {
      for (let i = 0; i < this.valuesList.length; i++) {
        var series = this.createSeries("value" + i.toString(), "date", this.playersList[i + 1].toString());
        this.chart.scrollbarX.series.push(series);
      }
    }
    else {
      var series = this.createSeries("value", "date", this.playersList[this.selectedPlayerIndex])
      this.chart.scrollbarX.series.push(series);
    }

    // scrollbar Customization
    this.chart.scrollbarX.scrollbarChart.series.getIndex(0).xAxis.startLocation = 0.5;
    this.chart.scrollbarX.scrollbarChart.series.getIndex(0).xAxis.endLocation = 0.5;
    this.chart.scrollbarX.marginBottom = 0;
    this.chart.scrollbarX.parent = this.chart.bottomAxesContainer;
    let scrollAxis = this.chart.scrollbarX.scrollbarChart.xAxes.getIndex(0);
    scrollAxis.renderer.labels.template.disabled = true;
    scrollAxis.renderer.grid.template.disabled = true;
    scrollAxis.filters.clear();
    this.chart.scrollbarX.series.stroke = "#0000ffff"
    this.customizeGrip(this.chart.scrollbarX.startGrip);
    this.customizeGrip(this.chart.scrollbarX.endGrip);
    let scrollSeries1 = this.chart.scrollbarX.series.getIndex(0);
    scrollSeries1.filters.clear();
    this.chart.scrollbarX.series.stroke = "#0000ffff"



    //legend
    if (this.selectedPlayerIndex == 0) {
      this.chart.legend = new am4charts.Legend()
      this.chart.legend.useDefaultMarker = true;
      let marker = this.chart.legend.markers.template.children.getIndex(0);
      marker.cornerRadius(12, 12, 12, 12);
      marker.strokeWidth = 8;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ffffff");

      if (this.valuesList.length > 6) {
        this.chart.legend.position = "right";
        this.chart.legend.scrollable = true;
      }
      else {
        this.chart.legend.position = "top"
        this.chart.legend.align = "left";
        this.chart.legend.contentAlign = "left";
        this.chart.legend.marginLeft = 50
        this.chart.legend.marginBottom = 20
      }
    }
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
