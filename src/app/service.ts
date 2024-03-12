import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeispielService {
  private baseUrl = '/:3000';

  constructor(private http: HttpClient) { }
}
