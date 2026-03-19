package com.naved.Workflow_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class workflowDTO {
   private Integer priority;
    String condition ;
    String actions;
}
