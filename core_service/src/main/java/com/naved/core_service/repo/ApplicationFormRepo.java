package com.naved.core_service.repo;

import com.naved.core_service.model.ApplicationForm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationFormRepo extends JpaRepository<ApplicationForm , Integer> {
}
