package com.naved.Workflow_engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class WorkflowEngineApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkflowEngineApplication.class, args);
	}

}