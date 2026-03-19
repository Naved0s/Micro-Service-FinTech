package com.naved.Workflow_engine.rules;

import lombok.extern.slf4j.Slf4j;
import org.jeasy.flows.work.*;
import org.jeasy.rules.api.Facts;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class DecisionWork implements Work {
    private String condition;

    public DecisionWork(String condition) {
        this.condition = condition;
    }

    @Override
    public WorkReport execute(WorkContext workContext) {
      Facts f =(Facts) workContext.get("Facts");
        Map<String, Object> vars = new HashMap<>();
        vars.put("ctx", f.get("ctx"));
        vars.put("log", f.get("log"));
        boolean result = (Boolean) org.mvel2.MVEL.eval(condition, vars);

        if(result){

            return new DefaultWorkReport(WorkStatus.COMPLETED,workContext);
        }else {
            return  new DefaultWorkReport(WorkStatus.FAILED,workContext);
        }

    }


}
