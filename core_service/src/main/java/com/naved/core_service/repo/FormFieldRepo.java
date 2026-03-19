package com.naved.core_service.repo;

import com.naved.core_service.model.FormField;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormFieldRepo extends JpaRepository<FormField,Integer> {
}
