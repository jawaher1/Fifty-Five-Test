import { Component, OnInit } from '@angular/core';
import { PlayersDataService } from './@core/services/players-data/players-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fifty-five-test';
  selectedPlayer : string;
  playersData: any;
  keysList: any = [];
  valuesList: any = [];
  playersList: string[] = ["All Players"]
  selectedPlayerIndex: number = 0; // initial value is 0 in order to display the chart of all players by default
  playersNames: any[];

  constructor(
    private playersService: PlayersDataService) { }


  ngOnInit() {
    this.getData(() => {
      this.selectedPlayer = "All Players"
      this.prepareChartData() 
    })

  }


  onChange(value: any) {
    this.selectedPlayer = this.playersList[this.playersNames.indexOf(value)];
    console.log(this.selectedPlayer)
    this.selectedPlayerIndex = this.playersList.indexOf(this.selectedPlayer)
  }

  getData(callback: Function) {
    this.playersService.getPlayersData().subscribe(
      (data) => {
        this.playersData = data;
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

  getPlayerNameById(id:string){
    return this.playersData["settings"]["dictionary"][id].firstname
  }

  prepareChartData() {
    this.keysList = (this.playersData["data"]["DAILY"].dates)
    //Cleaning null Values
    this.keysList.forEach(this.formatDate)
    var keysList = this.keysList.map((x: any) => {
      if (typeof x !== "string") {
        return NaN
      }
      return new Date(x).toString().substring(4, 10)
    })
    this.playersList = this.playersList.concat(Object.keys(this.playersData["data"]["DAILY"].dataByMember.players))
    //Mapping ids with real Names for a cleaner display
    this.playersNames = [this.playersList[0]].concat(this.playersList.slice(1,this.playersList.length).map( player => this.getPlayerNameById(player)))
    for (let i = 1; i< this.playersList.length; i++) {
      var valuesList = (this.playersData["data"]["DAILY"].dataByMember.players[this.playersList[i]]).points
      //Cleaning null values
      valuesList.filter(this.CleanNullValues);
      this.valuesList.push(valuesList)
    }
  }
}
