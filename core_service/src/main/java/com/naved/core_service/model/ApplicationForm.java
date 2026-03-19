package com.naved.core_service.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class ApplicationForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    String name;
    String description;
    String stageName;
    String entityType;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference
   private List<FormField> fields;
}
