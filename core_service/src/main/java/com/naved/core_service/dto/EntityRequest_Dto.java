package com.naved.core_service.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class EntityRequest_Dto {
    private String name;
    private String govId;
    private String type;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;

    @DateTimeFormat()
    private LocalDate dob;
}
