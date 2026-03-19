package com.naved.core_service.repo;

import com.naved.core_service.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepo extends JpaRepository<Application , Integer> {
}
