import {TestBed} from '@angular/core/testing';
import {InteractionObject } from '@pact-foundation/pact-web';
import {PactUtils} from './pact-utils';
import {RuleService} from './rule-service.service';
import {Rule} from '../model/rule';
import {HttpClientModule} from '@angular/common/http';
import {Pact} from '@pact-foundation/pact';

const provider: Pact = PactUtils.getProvider('rule-service', 'my-provider');

const mockRule: Rule = {
  index: 0,
  name: 'mock Rule'
};
const getArtifactsInteraction: InteractionObject = PactUtils.getTaskStatusStartInteraction('/endpoint_A',
  '/endpoint_B/' + PactUtils.MOCK_TASK_ID);
const getArtifactsCompletedInteraction: InteractionObject =
  PactUtils.getTaskStatusCompletedInteraction('/endpoint_B/' + PactUtils.MOCK_TASK_ID, mockRule);

// Setup Pact mock server for this service
beforeAll(async () => {
  await provider.setup();
});

// Verify mock service
afterEach(async () => {
  await provider.verify();
});

// Create contract
afterAll(async () => {
  await provider.finalize();
});

// Configure Angular Testbed for this service
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ],
    providers: [
      RuleService
    ]
  });
});

describe('RuleService::getRules()', () => {
  beforeAll(async () => {
    await provider.addInteraction(getArtifactsInteraction);
    await provider.addInteraction(getArtifactsCompletedInteraction);
  });

  it('should get all rules', async (done) => {
    const ruleService: RuleService = TestBed.inject(RuleService);
    ruleService.getRules().subscribe((response) => {
      expect(response).toEqual([mockRule]);
      done();
    });
  });
});
