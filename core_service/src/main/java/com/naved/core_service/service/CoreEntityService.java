package com.naved.core_service.service;

import com.naved.core_service.dto.*;
import com.naved.core_service.model.*;
import com.naved.core_service.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    public int createEntity(CoreEntity e){
        return coreEntityRepo.save(e).getId();
    }

    public void updateIndiviualEntity(int id , Individual_dto i){
    Individual old_i =  individualRepo.findById(id).get();
    old_i.setFirstName(i.getFirstName());
    old_i.setMiddleName(i.getMiddleName());
    old_i.setLastName(i.getLastName());
    old_i.setDob(i.getDob());
    old_i.setEmail(i.getEmail());
    old_i.setGovid(i.getGov_id());
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

    public Integer findOrCreatePerson(Individual_dto dto){
        Optional<Individual> exisiting  = individualRepo.findByGovid(dto.getGov_id());
      //  System.out.println("THis is existing gov id"+exisiting.get());
        Individual person;
        if(exisiting.isPresent()){
            person = exisiting.get();
        } else{
            person = new Individual();
            person.setType("Person");
        }

            person.setName(dto.getFirstName());
            person.setFirstName(dto.getFirstName());
            person.setLastName(dto.getLastName());
            person.setMiddleName(dto.getMiddleName());
            person.setGovid(dto.getGov_id());
            person.setEmail(dto.getEmail());
            person.setDob(dto.getDob());
            try{
            return individualRepo.save(person).getId();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<CoreEntity> getAll(){
        return coreEntityRepo.findAll();
    }

    public void createApplication(Application_dto app){
        Application a = new Application();
        a.setEntity(coreEntityRepo.findById(app.getEntityid()).get());
        a.setApplicationForm(applicationFormRepo.findById(app.getFormid()).get());
        a.setStatus(app.getStatus());
        applicationRepo.save(a);
    }

    public void createForm(ApplicationForm form){
        if (form.getFields() != null) {
            for (FormField field : form.getFields()) {
                field.setForm(form); // 🔥 THIS LINKS THEM
            }
        }
        applicationFormRepo.save(form);

    }
    public void addField(int id , FormField formField){
        ApplicationForm form = applicationFormRepo.findById(id).get();
        formField.setForm(form);
        form.getFields().add(formField);
        applicationFormRepo.save(form);
    }

    public void deleteField(int id){
        formFieldRepo.deleteById(id);
    }

    public void updateFieldValue(int applicationId, String fieldName, String newValue) {
        // Find the existing FieldValue by applicationId + fieldName
        List<FieldValue> values = fieldValueRepo.findByApplicationId(applicationId);

        values.stream()
                .filter(fv -> fv.getFormField().getFieldName().equals(fieldName))
                .findFirst()
                .ifPresent(fv -> {
//                    System.out.println("This is what the field udpating is "+fv.getId()+fv.getFormField().getFieldName()+newValue);
                    fv.setValue(newValue);
                    fieldValueRepo.save(fv);
                });
    }

    public ApplicationForm getAppicationForm(int id ){
        return applicationFormRepo.findById(id).get();
    }

    public Application getApplication(int id ){
        return applicationRepo.findById(id) .orElseThrow(() -> new RuntimeException(
                "Application not found with id: " + id
        ));
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

  public  Application submitApplicationRequest(int id , SubmitApplicationRequest_Dto dto){
        ApplicationForm app = applicationFormRepo.findById(id).get();

        Application subform = new Application();
        subform.setApplicationForm(app);
        subform.setEntity(coreEntityRepo.findById(dto.getApplicationDto().getEntityid()).get());
      subform.setStatus("Submitted");
      subform = applicationRepo.save(subform);


      System.out.println("THis is entity from the application form"+coreEntityRepo.findById(dto.getApplicationDto().getEntityid()).get());
        for(FieldValueRequest_Dto f : dto.getFieldValues()){
            FormField field = formFieldRepo.findById(f.getFieldId()).orElseThrow(() -> new RuntimeException("Field not found"));
            FieldValue value = new FieldValue();
           value.setApplication(subform);
            value.setFormField(field);
            value.setValue(f.getValue());
            fieldValueRepo.save(value);
        }

        app.setStageName("SUBMITTED");
      applicationRepo.save(subform);
        return subform;
//        applicationFormRepo.save(app);
//      applicationRepo.save(subform);
    }

    public ApplicationFormDto getApplicationWithDetails(int id ) {
/*
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
            dto.setGovid(individual.getGovid());
            app.setEntity(dto);
        }

 */
        Application a = getApplication(id);

        ApplicationForm f = a.getApplicationForm();
        CoreEntity entity = a.getEntity();

        ApplicationFormDto app = new ApplicationFormDto();
        app.setName(f.getName());
        app.setEntityType(f.getEntityType());
        app.setStageName(f.getStageName());
        app.setDescription(f.getDescription());
        app.setEntity(entity);

      //  System.out.println("This is the application :"+a.getApplicationForm().getFields().get(0).getFieldName());

        // Fetch values (make sure you're using correct repo method)
        List<FieldValue> values = fieldValueRepo.findByApplicationId(a.getId());
        System.out.println("This is the Field Values :"+values);
        // Convert to Map<FieldId, Value> with duplicate handling
        Map<Integer, String> valueMap = values.stream()
                .filter(v -> v.getFormField() != null) // safety check
                .collect(Collectors.toMap(
                        v -> v.getFormField().getId(),
                        FieldValue::getValue,
                        (existing, replacement) -> existing // handle duplicates
                ));

        // Map fields with values (null-safe)
        List<FormFieldDto> fields = f.getFields().stream()
                .map(field -> {
                    String value = valueMap.getOrDefault(field.getId(), null);
                    // use "" instead of null if needed:
                    // String value = valueMap.getOrDefault(field.getId(), "");

                    return new FormFieldDto(
                            field.getId(),
                            field.getFieldName(),
                            field.getFieldType(),
                            field.isRequired(),
                            value
                    );
                })
                .toList();

        app.setFields(fields);
        return app;
    }

    public List<ApplicationForm> getAllForms(){
        return applicationFormRepo.findAll();
    }
}
