package com.naved.core_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Company extends CoreEntity{


    String company_name;
    String tax_id;
    String email;
    String industry;

    String website;

    String reg_no;
}
