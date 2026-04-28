package com.naved.core_service.feignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

//@FeignClient(name = "WORKFLOW-ENGINE")
@FeignClient(name = "workflow-engine")
public interface WorkflowFeignClient {

    @GetMapping("/{id}")
    public String getWorkflowName(@PathVariable int id);

    @PostMapping("/executeFlowWithData/{id}")
    public Map<String,Object> executeFlowWithData(@PathVariable int id , @RequestBody Map<String, Object> incomingFormData);

}