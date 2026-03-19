package com.naved.Workflow_engine.rules;

import java.util.ArrayList;
import java.util.List;

public class LogCollectors {
    private final List<String> logs = new ArrayList<>();

    public void print(String message) {
        logs.add(message);
    }

    public List<String> getLogs() {
        return logs;
    }

    
}
