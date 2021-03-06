import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import * as BooksActions from './books.actions';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime } from 'rxjs/operators';
import { Book } from '@tmo/shared/models';

@Injectable()
export class BooksEffects {
  searchBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.searchBooks),
      fetch({
        run: action => {
          return this.http
            .get<Book[]>(`/api/books/search?q=${action.term}`)
            .pipe(
              debounceTime(500),
              map(data => BooksActions.searchBooksSuccess({ books: data }))
            );
        },

        onError: (action, error) => {
          console.error('Error', error);
          return BooksActions.searchBooksFailure({ error });
        }
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient
  ) {}
}
