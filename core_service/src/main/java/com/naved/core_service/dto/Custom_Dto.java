package com.naved.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Custom_Dto {
    String firstName;
    String middleName;
    String lastName;
    String email;

    String gov_id;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    String company_name;
    String tax_id;
    String industry;

    String website;

    String reg_no;
}
