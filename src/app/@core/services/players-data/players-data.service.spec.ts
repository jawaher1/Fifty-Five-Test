/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlayersDataService } from './players-data.service';

describe('Service: PlayersData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayersDataService]
    });
  });

  it('should ...', inject([PlayersDataService], (service: PlayersDataService) => {
    expect(service).toBeTruthy();
  }));
});
