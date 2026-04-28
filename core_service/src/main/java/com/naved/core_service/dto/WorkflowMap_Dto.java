package com.naved.core_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkflowMap_Dto {
    private Integer onSaveWorkflowId;
    private Integer onSubmitWorkflowId;
    private Integer onApproveWorkflowId;
    private Integer onRejectWorkflowId;
}
