package com.naved.core_service.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class FormField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    String fieldName;

    String fieldType;

    boolean required;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "form_id")
    private ApplicationForm form;

}
