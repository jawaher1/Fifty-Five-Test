import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URLSConfigs } from '../../config/urls';

@Injectable({
  providedIn: 'root'
})
export class PlayersDataService {

  constructor(private http: HttpClient) { }

  getPlayersData(): Observable<any> {
    return this.http.get<any>(`${URLSConfigs.BASE_URL}/${URLSConfigs.GET_PLAYERS_DATA}`)
  }

}
