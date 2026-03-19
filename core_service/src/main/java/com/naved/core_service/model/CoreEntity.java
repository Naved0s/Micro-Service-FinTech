package com.naved.core_service.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME,property = "type" , visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Individual.class,name = "Person")
        ,@JsonSubTypes.Type(value = Company.class,name = "Company")
})
@Entity(name = "Entity")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class CoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    String name;

    String type;

}
