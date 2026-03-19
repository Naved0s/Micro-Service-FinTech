package com.naved.core_service.service;

import com.naved.core_service.dto.*;
import com.naved.core_service.model.*;
import com.naved.core_service.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CoreEntityService {

    @Autowired
    CoreEntityRepo coreEntityRepo;

    @Autowired
    IndividualRepo individualRepo;

    @Autowired
    CompanyRepo companyRepo;

    @Autowired
    ApplicationRepo applicationRepo;

    @Autowired
    ApplicationFormRepo applicationFormRepo;

    @Autowired
    FormFieldRepo formFieldRepo;

    @Autowired
    FieldValueRepo fieldValueRepo;

    public void createEntity(CoreEntity e){
        coreEntityRepo.save(e);
    }

    public void updateIndiviualEntity(int id , Individual_dto i){
    Individual old_i =  individualRepo.findById(id).get();
    old_i.setFirstName(i.getFirstName());
    old_i.setMiddleName(i.getMiddleName());
    old_i.setLastName(i.getLastName());
    old_i.setDob(i.getDob());
    old_i.setEmail(i.getEmail());
    old_i.setGov_id(i.getGov_id());
    individualRepo.save(old_i);
    }

    public void updateCompanyEntity(int id , Company_dto c){
        Company old_c = companyRepo.findById(id).get();
        old_c.setCompany_name(c.getCompany_name());
        old_c.setIndustry(c.getIndustry());
        old_c.setEmail(c.getEmail());
        old_c.setReg_no(c.getReg_no());
        old_c.setTax_id(c.getTax_id());
        old_c.setWebsite(c.getWebsite());
        companyRepo.save(old_c);
    }

    public void createApplication(Application_dto app){
        Application a = new Application();
        a.setEntity(coreEntityRepo.findById(app.getEntityid()).get());
        a.setApplicationForm(applicationFormRepo.findById(app.getFormid()).get());
        a.setStatus(app.getStatus());
        applicationRepo.save(a);
    }

    public void createForm(ApplicationForm form){
        applicationFormRepo.save(form);

    }
    public void addField(int id , FormField formField){
        ApplicationForm form = applicationFormRepo.findById(id).get();
        formField.setForm(form);
        form.getFields().add(formField);
        applicationFormRepo.save(form);
    }

    public ApplicationForm getAppicationForm(int id ){
        return applicationFormRepo.findById(id).get();
    }

    public Application getApplication(int id ){
        return applicationRepo.findById(id).get();
    }

    public Individual_dto getIndividualEntity(int id ){
        //Application e =
        Individual old =  individualRepo.findById(id).get();
        Individual_dto i = new Individual_dto();
        i.setFirstName(old.getFirstName());
        i.setEmail(old.getEmail());
        i.setMiddleName(old.getMiddleName());
        i.setDob(old.getDob());
        return i;
    }

  public  void submitApplicationRequest(int id , SubmitApplicationRequest_Dto dto){
        ApplicationForm app = applicationFormRepo.findById(id).get();
        for(FieldValueRequest_Dto f : dto.getFieldValues()){
            FormField field = formFieldRepo.findById(f.getFieldId()).orElseThrow(() -> new RuntimeException("Field not found"));
            FieldValue value = new FieldValue();
           value.setApplicationForm(app);
            value.setFormField(field);
            value.setValue(f.getValue());
            fieldValueRepo.save(value);
        }
        app.setStageName("SUBMITTED");
        applicationFormRepo.save(app);
    }

    public ApplicationFormDto getApplicationWithDetails(int id ) {

        Application a = getApplication(id);
        ApplicationForm f = a.getApplicationForm();
        CoreEntity entity = a.getEntity();
        ApplicationFormDto app = new ApplicationFormDto();
        app.setName(f.getName());
        app.setEntityType(f.getEntityType());
        app.setStageName(f.getStageName());
        app.setDescription(f.getDescription());
//        List<FieldValue> values = fieldValueRepo.findByApplicationId(a.getId());
        List<FieldValue> values =
                fieldValueRepo.findByApplicationFormId(a.getId());
        Map<Integer, String> valueMap =
                values.stream()
                        .collect(Collectors.toMap(
                                v -> v.getFormField().getId(),
                                FieldValue::getValue
                        ));
        List<FormFieldDto> fields = f.getFields().stream().map(field -> new FormFieldDto(
                field.getId(),
                field.getFieldName(),
                field.getFieldType(),
                field.isRequired(),
                valueMap.get(field.getId())


        )).toList();
        app.setFields(fields);
        if (entity instanceof Individual individual) {
            Individual_dto dto = new Individual_dto();
            dto.setFirstName(individual.getFirstName());
            dto.setMiddleName(individual.getMiddleName());
            dto.setEmail(individual.getEmail());
            dto.setLastName(individual.getLastName());
            dto.setDob(individual.getDob());
            dto.setGov_id(individual.getGov_id());
            app.setEntity(dto);
        }
        return app;
    }
}
