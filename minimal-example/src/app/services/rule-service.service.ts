import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Rule} from '../model/rule';
import {Observable, Subscriber} from 'rxjs';
import {UniqueHeaders} from '../model/unique-headers';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  constructor(@Inject(HttpClient) private httpClient: HttpClient) {
  }

  getRules(): Observable<Rule[]> {
    return new Observable<Rule[]>((subscriber => {
      this.httpClient.get<Rule[]>('endpoint_A', {observe: 'response'})
        .subscribe((response) => {
          this.checkResponse(response, subscriber);
        });
    }));
  }

  private checkResponse(httpResp: HttpResponse<any>, subscriber: Subscriber<any>, lastDelay?: number): void {
    if (httpResp.status === 200) {
      // The task has completed, see if we need to make another call to get the result
      const retrievalUrl: string = httpResp.headers.get(UniqueHeaders.LOCATION);
      if (location) {
        // Make the call and return the result to the observer
        this.httpClient.get<any>(retrievalUrl).subscribe(
          (resp: any) => subscriber.next(resp)
        );
      } else {
        // Just return the result
        subscriber.next(httpResp.body);
      }
      return;
    }

    if (httpResp.status === 202 || httpResp.status === 204) {
      // We will initially get a 202 for Accepted and then 204s as we poll to check the progress.  Notify
      // the observer we're making another call and then do it after waiting a bit.
      subscriber.next(null);

      // See if the server is telling us how long to delay before calling back
      let delay = Number(httpResp.headers.get(UniqueHeaders.DELAY));
      console.log(UniqueHeaders.DELAY + ' : ' + delay);
      if (isNaN(delay) || delay < 1) {
        // If there wasn't a header or the value is not valid, use either the last known delay or a default of 1 second
        delay = (lastDelay) ? lastDelay : 1000;
      }
      const retrievalUrl: string = httpResp.headers.get(UniqueHeaders.LOCATION);
      console.log(UniqueHeaders.LOCATION + ' : ' + retrievalUrl);
      setTimeout(() => {
        this.httpClient.get<any>(retrievalUrl, {observe: 'response'}).subscribe(
          (nextHttpResp: HttpResponse<any>) => this.checkResponse(nextHttpResp, subscriber, delay)
        );
      }, delay);
    }
  }


}
