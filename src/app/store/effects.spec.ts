import { Observable, of } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { DataEffects } from './effects';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Action } from '@ngrx/store';

describe('AppEffects', () => {
    let effects: DataEffects;
    let actions$: Observable<Action>;
    let store: MockStore;
    let httpMock: HttpTestingController;
    const initialState = [];

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DataEffects,
                provideMockActions(() => actions$),
                provideMockStore({ initialState }),
            ],
        }).compileComponents();
        effects = TestBed.inject(DataEffects);
        httpMock = TestBed.inject(HttpTestingController);
        store = TestBed.inject(MockStore);
    });

    fit('Should make a request to the API', (done) => {

        const params = {
            pitchID: 32990,
            startDate: '2020-10-2',
            endDate: '2020-10-3'
        };

        actions$ = of({ type: '[SEARCH_DATA]', payload: params });
        effects.searchAPIData$.subscribe(r => {
            console.log(r);
            done();
        });

        const req = httpMock.expectOne({
            url: `https://api-v2.pfstaging.xyz/pitches/${params.pitchID}/slots?filter%5Bstarts%5D=${params.startDate}&filter%5Bends%5D=${params.endDate}`,
            method: 'GET'
        });
        req.flush(params);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
