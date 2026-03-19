package com.naved.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubmitApplicationRequest_Dto {
    private List<FieldValueRequest_Dto> fieldValues;
}
