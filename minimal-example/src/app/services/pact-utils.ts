import {InteractionObject, Pact} from '@pact-foundation/pact';
import * as path from 'path';
import { Matchers } from '@pact-foundation/pact-web';

export class PactUtils {
  static MOCK_TASK_ID = '9f32d86d-e62a-4cf7-a60a-f9311a57c8ca';

  public static getProvider(serviceName: string, provider: string): Pact {
    return new Pact({
      port: 8080,
      log: path.resolve(process.cwd(), 'pact', 'logs', serviceName + '.log'),
      dir: path.resolve(process.cwd(), 'pact', 'pacts'),
      spec: 2,
      logLevel: 'info',
      consumer: 'my-consumer',
      provider,
      pactfileWriteMode: 'update'
    });
  }

  /**
   * This creates an InteractionObject which starts a task by calling the start_url and returns a
   * taskID.  The taskID is then used as a path param to the monitor_url to check on the task progress.
   */
  public static getTaskStatusStartInteraction(startUrl: string, monitorUrl: string): InteractionObject {
    return {
      state: 'a task is executing',
      uponReceiving: 'a request to run a task',
      withRequest: {
        method: 'GET',
        path: startUrl
      },
      willRespondWith: {
        status: 202,
        headers: {
          'Content-Type': 'text/plain',
          Location: monitorUrl,
          'x-delay': '10'
        },
        body: Matchers.somethingLike(PactUtils.MOCK_TASK_ID)
      }
    };
  }

  /**
   * This creates an InteractionObject which checks the progress of a task by calling the monitor_url with
   * a taskID as a path param.  Should return an array containing at least one object.
   */
  public static getTaskStatusCompletedInteraction(monitorUrl: string, mockBodyObject: any): InteractionObject {
    return {
      state: 'a task is completed',
      uponReceiving: 'a request to check the status of a task',
      withRequest: {
        method: 'GET',
        path: monitorUrl
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: Matchers.eachLike(mockBodyObject)
      }
    };
  }
}
