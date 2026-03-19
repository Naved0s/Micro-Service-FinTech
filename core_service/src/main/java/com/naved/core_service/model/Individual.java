package com.naved.core_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    String gov_id;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;


}
