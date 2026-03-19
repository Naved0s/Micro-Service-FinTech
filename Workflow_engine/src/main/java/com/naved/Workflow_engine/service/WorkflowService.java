package com.naved.Workflow_engine.service;

import com.naved.Workflow_engine.dto.workflowDTO;
import com.naved.Workflow_engine.model.FlowModel;
import com.naved.Workflow_engine.model.WorkflowModel;
import com.naved.Workflow_engine.repo.FlowModelRepo;
import com.naved.Workflow_engine.repo.WorkflowRepo;
import com.naved.Workflow_engine.rules.DecisionWork;
import com.naved.Workflow_engine.rules.LogCollectors;
import com.naved.Workflow_engine.rules.MVELRuleWork;
import com.naved.Workflow_engine.rules.WorkflowContext;
import lombok.extern.slf4j.Slf4j;
import org.jeasy.flows.engine.WorkFlowEngine;
import org.jeasy.flows.engine.WorkFlowEngineBuilder;
import org.jeasy.flows.work.WorkContext;
import org.jeasy.flows.work.WorkReportPredicate;
import org.jeasy.flows.workflow.ConditionalFlow;
import org.jeasy.flows.workflow.RepeatFlow;
import org.jeasy.flows.workflow.SequentialFlow;
import org.jeasy.flows.workflow.WorkFlow;
import org.jeasy.rules.api.Facts;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.jeasy.rules.core.DefaultRulesEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.autoconfigure.JacksonProperties;
import org.springframework.stereotype.Service;
import org.jeasy.rules.mvel.MVELRule;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@Slf4j
@Service
public class WorkflowService {

    @Autowired
    WorkflowRepo workflowRepo;

    @Autowired
    FlowModelRepo flowModelRepo;


    WorkflowContext ctx = new WorkflowContext();

    private static final Logger logger = LoggerFactory.getLogger(WorkflowService.class);


   public WorkflowModel getWorkflowById(int id ){
        return workflowRepo.findById(id).get();
    }

   public boolean saveWorkflow(WorkflowModel wf){
        workflowRepo.save(wf);
        return true;
    }

   public WorkflowModel getWorkflowByName(String name){
        return workflowRepo.findByname(name).stream().findFirst().get();
    }

    public List<WorkflowModel> getAll(){
        return workflowRepo.findAll();
    }

    public List<String> execute(WorkflowModel wf){
        LogCollectors lg = new LogCollectors();
        Facts facts = new Facts();
        facts.put("ctx",ctx);
        facts.put("log",lg);
        MVELRule rule = new MVELRule().name(wf.getName()).description(wf.getDescription()).priority(wf.getPriority()).when(wf.getCondition()).then(wf.getActions());
        Rules rules = new Rules();
        rules.register(rule);
        RulesEngine re = new DefaultRulesEngine();
        re.fire(rules,facts);
        return lg.getLogs();


    }


    public List<String> executeById(int id){
       Facts f = new Facts();
        LogCollectors lg = new LogCollectors();
       f.put("ctx",ctx);
       f.put("log",lg);
       WorkflowModel wf =  workflowRepo.findById(id).get();
       MVELRule rule = new MVELRule().name(wf.getName()).description(wf.getDescription()).when(wf.getCondition()).priority(wf.getPriority()).then(wf.getActions());
       RulesEngine re = new DefaultRulesEngine();
       Rules r = new Rules();
       r.register(rule);
       re.fire(r,f);
       return lg.getLogs();
    }

    public void updateById(int id , workflowDTO dto){
      WorkflowModel wf =  workflowRepo.findById(id).get();


        if (dto.getPriority() != null) {
            wf.setPriority(dto.getPriority());
        }

        if (dto.getActions() != null) {
            wf.setActions(dto.getActions());
        }

        if (dto.getCondition() != null) {
            wf.setCondition(dto.getCondition());
        }
      workflowRepo.save(wf);
    }
   public void saveFlow(String json){
        ObjectMapper mp = new ObjectMapper();
        JsonNode js = mp.readTree(json);
        FlowModel f = new FlowModel();
        f.setFlowName(js.get("Name").asText());
        f.setFlowJson(json);
        flowModelRepo.save(f);

    }

    public List<String> executeWithFlow(String json){

        WorkContext workContext  = new WorkContext();
        Facts facts = new Facts();
        LogCollectors lg  = new LogCollectors();
        facts.put("ctx",ctx);
        facts.put("log",lg);
        workContext.put("Facts",facts);

        ObjectMapper mp = new ObjectMapper();
        JsonNode js = mp.readTree(json);
        String flowType = js.get("type").asText();



        if(flowType.equals("Sequential")){
            List<WorkflowModel> steps = new ArrayList<>();
            //{{"type": "sequential", "workflowIds": [1, 2, 3]}
            for(JsonNode j : js.get("workflowIds")){
                int id = j.asInt();
                steps.add(workflowRepo.findById(id).get());
            }
            SequentialFlow.Builder.NameStep flow = SequentialFlow.Builder
                    .aNewSequentialFlow();
            SequentialFlow.Builder.ThenStep next = null;
            for(WorkflowModel m : steps){
            MVELRuleWork worksteps = new MVELRuleWork(m);
            next  = flow.execute(worksteps);
            }
         WorkFlow fl =   next.build();
            WorkFlowEngine engine = WorkFlowEngineBuilder.aNewWorkFlowEngine().build();
            engine.run(fl,workContext);
            return lg.getLogs();
        }
        else if (flowType.equals("Conditional")) {
            DecisionWork condition = new DecisionWork(js.get("condition").asText());
            int trueWorkflowId = js.get("trueWorkflowId").asInt();
            int falseWorkflowId = js.get("falseWorkflowId").asInt();
            WorkflowModel trueStep = workflowRepo.findById(trueWorkflowId).get();
            WorkflowModel falseStep = workflowRepo.findById(falseWorkflowId).get();

            MVELRuleWork trueWork = new MVELRuleWork(trueStep);
            MVELRuleWork falseWork = new MVELRuleWork(falseStep);
            ConditionalFlow.Builder.NameStep flow = ConditionalFlow.Builder.aNewConditionalFlow();
           //execute
            WorkFlow foe = flow.execute(condition).when(WorkReportPredicate.COMPLETED).then(trueWork).otherwise(falseWork).build() ;
            WorkFlowEngine engine = WorkFlowEngineBuilder.aNewWorkFlowEngine().build();
            engine.run( foe, workContext);
            return lg.getLogs();
        }


        return lg.getLogs();
    }

    public List<String> executeFlowById(int id ){
       FlowModel flow = flowModelRepo.findById(id).get();
        System.out.println("This is flow"+flow.getFlowJson());
//       return executeWithFlow(flow.getFlowJson());
        return executeJFlows(flow.getFlowJson());
    }

    public List<String> executeJFlows(String json){
        WorkContext workContext  = new WorkContext();
        Facts facts = new Facts();
        LogCollectors lg  = new LogCollectors();
        facts.put("ctx",ctx);
        facts.put("log",lg);
        workContext.put("Facts",facts);

        ObjectMapper mp = new ObjectMapper();
        JsonNode js = mp.readTree(json);
        JsonNode steps = js.get("Steps");
//        System.out.println("THis are the steps"+ steps);
        for(JsonNode j : steps){
            if(j.get("type").asText().equals("Sequential")){
                System.out.println("Inside Seq flow");
                 List<String> check =    triggerSequential(j,workContext,lg);

//                System.out.println("THis is after sequential triggered"+check);
            } else if (j.get("type").asText().equals("Conditional")) {
               // DecisionWork condition = new DecisionWork(j.get("condition").asText());
                //covert the both json into works
                //trueStep:
                Map<String,Object> vars = new HashMap<>();
                vars.put("ctx", ctx);
                boolean result = (Boolean) org.mvel2.MVEL.eval(j.get("condition").asText(), vars);
                logger.info("THis is condition"+result);
//                System.out.println("THis is condition"+result);
                if(result){
                    JsonNode trueStep = j.get("trueStep");
                    triggerSequential(trueStep,workContext,lg);
                    logger.info("TrueStep Executed"+lg);
//                    System.out.println("TrueStep Executed"+lg);
                }else{
                    JsonNode falseStep = j.get("falseStep");
                    triggerSequential(falseStep,workContext,lg);
                    logger.info("FalseStep Executed"+lg);
//                    System.out.println("FalseStep Executed"+lg);
                }
            }
        }
        return lg.getLogs();
    }

    List<String> triggerSequential(JsonNode jnode , WorkContext workContext, LogCollectors lg){
        List<WorkflowModel> steps = new ArrayList<>();
//        System.out.println("WE are inside Trigger");
        for(JsonNode j : jnode.get("workflowIds")){
            int id = j.asInt();
//            System.out.println("THis is the id found "+j);
            steps.add(workflowRepo.findById(id).get());
        }
        SequentialFlow.Builder.NameStep flow = SequentialFlow.Builder
                .aNewSequentialFlow();
        SequentialFlow.Builder.ThenStep next = null;
        for(WorkflowModel m : steps){
            MVELRuleWork worksteps = new MVELRuleWork(m);
//            next  = flow.execute(worksteps);
            if(next == null){
                next = flow.execute(worksteps);
            } else {
                next = next.then(worksteps);
            }
        }
        WorkFlow fl =   next.build();
        WorkFlowEngine engine = WorkFlowEngineBuilder.aNewWorkFlowEngine().build();
        engine.run(fl,workContext);
//        System.out.println("THis are the logs"+lg.getLogs());
        return lg.getLogs();
    }

    public void updateJflowById(int id , String json){
       FlowModel f = flowModelRepo.findById(id).get();
       f.setFlowJson(json);
       flowModelRepo.save(f);

    }



//    public void sample(){
//        MVELRule ageRule = new MVELRule()
//                .name("age rule")
//                .description("Check if person's age is > 18 and mark the person as adult")
//                .priority(1)
//                .when("1==1")
//                .then("System.out.println(\"Hello World\");");
//        RulesEngine r = new DefaultRulesEngine();
//        Rules rules = new Rules();
//        rules.register(ageRule);
//        r.fire(rules,new Facts());
//
//    }


}
