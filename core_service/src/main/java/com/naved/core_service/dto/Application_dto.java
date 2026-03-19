package com.naved.core_service.dto;

import com.naved.core_service.model.ApplicationForm;
import com.naved.core_service.model.CoreEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Application_dto {
    int formid;
    int entityid;
    String status;
}
