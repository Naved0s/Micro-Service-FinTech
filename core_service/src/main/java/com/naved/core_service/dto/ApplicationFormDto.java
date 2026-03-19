package com.naved.core_service.dto;

import com.naved.core_service.model.CoreEntity;
import com.naved.core_service.model.FormField;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationFormDto {
    String name;
    String description;
    String stageName;
    String entityType;
    List<FormFieldDto> fields;
    Object entity;
}
