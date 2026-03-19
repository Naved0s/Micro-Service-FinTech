package com.naved.core_service.controller;

import com.naved.core_service.dto.*;
import com.naved.core_service.model.*;
import com.naved.core_service.service.CoreEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    CoreEntityService coreEntityService;



    @PostMapping("/create")
    void createEntity(@RequestBody CoreEntity e){
        coreEntityService.createEntity(e);
    }

    @PutMapping("/update/indi/{id}")
    void updateIndiviualInfo(@PathVariable int id , @RequestBody Individual_dto i){
        coreEntityService.updateIndiviualEntity(id,i);

    }

    @PutMapping("/update/comp/{id}")
    void updateCompanyInfo(@PathVariable int id , @RequestBody Company_dto c){
        coreEntityService.updateCompanyEntity(id,c);
    }

    @PostMapping("/form/create")
    void createForm(@RequestBody ApplicationForm form){
        coreEntityService.createForm(form);
    }

    @PostMapping("/create/app")
    void createApplication(@RequestBody Application_dto app){
        coreEntityService.createApplication(app);
    }

    @PutMapping("/edit/form/{id}/save")
    void addFieldsToForm(@PathVariable int id , @RequestBody FormField f){
        coreEntityService.addField(id,f);

    }
    @GetMapping("/getform/{id}")
    public ResponseEntity<ApplicationFormDto> getForm(@PathVariable int id){
//    ApplicationForm f = coreEntityService.getAppicationForm(id);
//
//      Application a = coreEntityService.getApplication(id);
//      ApplicationForm f = a.getApplicationForm();
//      CoreEntity entity = a.getEntity();
//            ApplicationFormDto app = new ApplicationFormDto();
//            app.setName(f.getName());
//            app.setEntityType(f.getEntityType());
//            app.setStageName(f.getStageName());
//            app.setDescription(f.getDescription());
//
//              List<FormFieldDto> fields = f.getFields().stream().map(field -> new FormFieldDto(
//                      field.getId(),
//                      field.getFieldName(),
//                      field.getFieldType(),
//                      field.isRequired()
//
//
//              )).toList();
//        app.setFields(fields);
//        if(entity instanceof  Individual individual){
//            Individual_dto dto = new Individual_dto();
//            dto.setFirstName(individual.getFirstName());
//            dto.setMiddleName(individual.getMiddleName());
//            dto.setEmail(individual.getEmail());
//            dto.setLastName(individual.getLastName());
//            dto.setDob(individual.getDob());
//            dto.setGov_id(individual.getGov_id());
//            app.setEntity(dto);
//        }
        //If company then company details
        return ResponseEntity.ok(coreEntityService.getApplicationWithDetails(id));
    }

    //save field value
    @PutMapping("/app/{id}/submit")
    void saveField(@PathVariable int id  ,@RequestBody SubmitApplicationRequest_Dto submitApplicationRequestDto){
        coreEntityService.submitApplicationRequest(id,submitApplicationRequestDto);
    }



}
