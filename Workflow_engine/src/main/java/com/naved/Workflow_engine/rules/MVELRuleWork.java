package com.naved.Workflow_engine.rules;

import com.naved.Workflow_engine.model.WorkflowModel;
import org.jeasy.flows.work.*;
import org.jeasy.rules.api.Facts;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.jeasy.rules.core.DefaultRulesEngine;
import org.jeasy.rules.mvel.MVELRule;


public class MVELRuleWork implements Work {
    private final WorkflowModel wf;
    public MVELRuleWork(WorkflowModel wf) {
        this.wf = wf;
    }

    @Override
    public String getName() {
        return wf.getName();
    }

    @Override
    public WorkReport execute(WorkContext workContext) {
        Facts facts = (Facts) workContext.get("Facts");
        MVELRule rule = new MVELRule()
                .name(wf.getName())
                .description(wf.getDescription())
                .priority(wf.getPriority())
                .when(wf.getCondition())
                .then(wf.getActions());
        Rules rules = new Rules();
        rules.register(rule);
        RulesEngine re = new DefaultRulesEngine();

        // 3. Fire the rules!
        re.fire(rules, facts);
        // If your business logic requires failing a flow step under certain conditions,
        // you would return WorkStatus.FAILED here. For now, we assume it completes successfully.
        return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);

    }
}
