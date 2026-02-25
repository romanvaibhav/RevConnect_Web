import { Injectable } from '@angular/core';
import { environment } from '../../envi/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Postservice {
  static baseUrl = environment.API_HOST_URL;

  constructor(private httpClient: HttpClient) {}

  getAllPosts(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.get(`${Postservice.baseUrl}/post/getposts`, { headers });
  }

  //
  // postLike():Observable<any>{
  //   const token = localStorage.getItem('token');
  //   const
  //    const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }
}
