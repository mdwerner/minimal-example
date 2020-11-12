import {Component, Inject, OnInit} from '@angular/core';
import {RuleService} from './services/rule-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'minimal-example';
  constructor(@Inject(RuleService) private ruleService: RuleService) {}

  checkRules(): void {
    this.ruleService.getRules();
  }

  ngOnInit(): void {
    this.checkRules();
  }
}
