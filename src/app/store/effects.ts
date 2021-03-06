import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SaveData, SearchActionTypes } from './actions';
import { HttpClient } from '@angular/common/http';
import { PitchData, ActionWithPayload } from '../shared';

@Injectable()
export class DataEffects {

    constructor(private readonly _http: HttpClient,
                private readonly actions$: Actions) { }

    @Effect()
    searchAPIData$ = this.actions$.pipe(
        ofType(SearchActionTypes.SEARCH_DATA),
        switchMap<ActionWithPayload<PitchData>, any>(action => {
            return this._http.get(`https://api-v2.pfstaging.xyz/pitches/${action.payload.pitchID}/slots?filter%5Bstarts%5D=${action.payload.startDate}&filter%5Bends%5D=${action.payload.endDate}`).pipe(
               map((response: any) => new SaveData(response.data)),
                catchError(err => {
                    throw new Error('Unable to make sufficient request');
                })
            );
        })
    );
}
