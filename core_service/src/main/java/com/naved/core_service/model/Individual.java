package com.naved.core_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Individual extends CoreEntity{

    String firstName;
    String middleName;
    String lastName;
    String email;
    @Column(name = "gov_id")
    String govid;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;


}
