package com.naved.core_service.repo;

import com.naved.core_service.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepo extends JpaRepository<Company , Integer> {
}
