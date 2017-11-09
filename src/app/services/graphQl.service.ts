import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';


const API_URL = 'http://localhost:3000/graphql';

@Injectable()
export class GraphQlService {
  constructor(
    private http: Http
  ) {
  }
  createQuery(query: string, variables: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    return this.http.post(API_URL, {
      query: query.replace(/\n/g, ' ').replace(/ +/g, ' '), variables: variables
    }, { headers: headers }).map(res => res.json());
  }
}
