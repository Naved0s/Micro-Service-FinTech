package com.naved.core_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "form_id")
   private ApplicationForm applicationForm;


    @ManyToOne
    @JoinColumn(name = "entity_id")
    CoreEntity entity;

    String status;

}
