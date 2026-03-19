package com.naved.core_service.repo;

import com.naved.core_service.model.CoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoreEntityRepo extends JpaRepository<CoreEntity,Integer> {
}
