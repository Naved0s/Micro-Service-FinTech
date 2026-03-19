package com.naved.core_service.repo;

import com.naved.core_service.model.Individual;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndividualRepo extends JpaRepository<Individual , Integer> {
}
