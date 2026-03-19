package com.naved.Workflow_engine.repo;

import com.naved.Workflow_engine.model.WorkflowModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface WorkflowRepo extends JpaRepository<WorkflowModel,Integer> {

    List<WorkflowModel> findByname(String workflowName);
}
