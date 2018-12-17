import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Todo } from './todo';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private session: SessionService) { }


  private API_URL = environment.apiUrl;


  public signIn(username: string, password: string) {
    return this.http
      .post(this.API_URL + '/sign-in', {
        username,
        password
      })
      .pipe(
        catchError(this.handleError('signIn')));
  }

  public getAllTodos() {

    return this.http.get<Todo[]>(this.API_URL + '/todos')
      .pipe(
        catchError(this.handleError('getAllTodos', []))
      );

  }

  public createTodo(todo: Todo) {
    return this.http.post<Todo>(this.API_URL + '/todos/', todo).pipe(
      tap((hero: Todo) => console.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Todo>('createTodo'))
    );
  }

  public getTodoById(id: number) {

    return this.http.get<Todo>(this.API_URL + '/todos/' + id)
      .pipe(
        catchError(this.handleError<Todo>(`getTodoById id=${id}`))
      );
  }

  public updateTodo(todo: Todo) {

    return this.http.put(this.API_URL + '/todos/' + todo.id, todo).pipe(
      tap(_ => console.log(`updated hero id=${todo.id}`)),
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  public deleteTodoById(id: number) {
    const url = `${this.API_URL}/todos/${id}`;

    return this.http.delete<Todo>(url).pipe(
      tap(_ => console.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Todo>('deleteTodoById'))
    );
  }


  public searchTodos(title: string): Observable<Todo[]> {
    if (!title.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Todo[]>(`${this.API_URL}/todos/?title=${title}`).pipe(
      tap(_ => console.log(`found todos matching "${title}"`)),
      catchError(this.handleError<Todo[]>('searchTodos', []))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
