package com.naved.Workflow_engine.controller;

import com.naved.Workflow_engine.dto.workflowDTO;
import com.naved.Workflow_engine.model.FlowModel;
import com.naved.Workflow_engine.model.WorkflowModel;
import com.naved.Workflow_engine.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class WorkflowController {

    @Autowired
    WorkflowService workflowService;

        @GetMapping("/{id}")
        WorkflowModel getWorkflowById(@PathVariable int id ){
            System.out.println( workflowService.getWorkflowById(id));
            return workflowService.getWorkflowById(id);
        }
        @DeleteMapping("/delete/{id}")
        String deleteById(@PathVariable int id ){
            workflowService.deleteById(id);
            return "Deleted the workflow"+id;
        }

        @DeleteMapping("/jflow/delete/{id}")
        String deleteJflowById(@PathVariable  int id){
            workflowService.deleteJflowById(id);
            return "Deleted the Jflow with Id:"+id;
        }

        @PostMapping("/save")
        void addWorkflow(@RequestBody WorkflowModel wf){
            workflowService.saveWorkflow(wf);
        }

        @GetMapping("/all")
        List<WorkflowModel> getAllWorkflows(){
            return workflowService.getAll();
        }

        @PostMapping("/run")
       List<String> tigger(@RequestBody WorkflowModel wf){
//            workflowService.sample();
           return workflowService.execute(wf);
        }

        @PostMapping("/{id}")
        List<String>  executeById(@PathVariable int id){
           return workflowService.executeById(id);
        }

        @PatchMapping("/update/{id}")
        void updateById(@PathVariable int id ,@RequestBody workflowDTO dto){
            workflowService.updateById(id,dto);
        }

        @PostMapping("/flow/save")
        void saveFlow(@RequestBody String json) throws Exception {
            workflowService.saveFlow(json);
        }

        @PostMapping("/flow/{id}")
        List<String> executeFlowById(@PathVariable int id ){
            return workflowService.executeFlowById(id);
        }

        @PostMapping("/execute/flow")
        List<String> executeByFlow(@RequestBody String flowModel){
            return workflowService.executeWithFlow(flowModel);
        }

        @PostMapping("/execute/hflow")
        List<String> executeJflow(@RequestBody String hyperModel){
            return  workflowService.executeJFlows(hyperModel);

        }

        @PatchMapping("/flow/update/{id}")
        void updateJflowById(@PathVariable int id , @RequestBody String json){
            workflowService.updateJflowById(id,json);
        }

        //get all JFlows
    @GetMapping("/jflows/all")
        List<FlowModel> getAllJFlows(){
            return workflowService.getAllJFlows();
        }



    @PostMapping("/executeFlowWithData/{id}")
    public Map<String, Object> executeFlowWithData(@PathVariable int id, @RequestBody Map<String, Object> incomingFormData) {
        return workflowService.executeWithDataId(id, incomingFormData);
    }




}
