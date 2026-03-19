package com.naved.Workflow_engine.rules;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


public class WorkflowContext {

    private Map<String, Object> data = new HashMap<>();

    public void put(String key , Object value){
        data.put(key,value);
    }
    public Object get(String key){
        return data.get(key);
    }

    public Map<String, Object> getAll() {
        return data;
    }

}
