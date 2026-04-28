package com.naved.core_service.repo;

import com.naved.core_service.model.FieldValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FieldValueRepo extends JpaRepository<FieldValue , Integer> {
    List<FieldValue> findByApplicationId(Integer formId);
}
