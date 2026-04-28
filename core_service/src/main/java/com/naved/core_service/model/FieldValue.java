package com.naved.core_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class FieldValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

//    @ManyToOne
//    @JoinColumn(name = "application_form_id")
//    ApplicationForm applicationForm;

    @ManyToOne
    @JoinColumn(name = "application_id")   // ✅ CHANGE THIS
    private Application application;

    @ManyToOne
    FormField formField;

    String Value;
}
