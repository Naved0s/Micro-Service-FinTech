package com.naved.core_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company_dto {
    String company_name;
    String tax_id;
    String email;
    String industry;

    String website;

    String reg_no;
}
