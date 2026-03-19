package com.naved.core_service.dto;


import com.naved.core_service.model.FieldValue;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormFieldDto {

    private Integer id;
    private String fieldName;
    private String fieldType;
    private boolean required;
    String value;


}
