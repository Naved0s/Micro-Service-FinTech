package com.naved.core_service.controller;

import com.naved.core_service.dto.*;
import com.naved.core_service.feignClient.WorkflowFeignClient;
import com.naved.core_service.model.*;
import com.naved.core_service.repo.ApplicationRepo;
import com.naved.core_service.service.CoreEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*" )
@RestController
public class Controller {

    @Autowired
    CoreEntityService coreEntityService;

    @Autowired
    WorkflowFeignClient workflowFeignClient;

    @Autowired
    ApplicationRepo applicationRepo;



    @PostMapping("/create")
    int createEntity(@RequestBody CoreEntity e){
      return coreEntityService.createEntity(e);
    }

    @PutMapping("/update/indi/{id}")
    void updateIndiviualInfo(@PathVariable int id , @RequestBody Individual_dto i){
        coreEntityService.updateIndiviualEntity(id,i);

    }

    @PutMapping("/update/comp/{id}")
    void updateCompanyInfo(@PathVariable int id , @RequestBody Company_dto c){
        coreEntityService.updateCompanyEntity(id,c);
    }

    @PostMapping("/person")
    public ResponseEntity<Integer> createOrupdate( @RequestBody Individual_dto dto){
        int id = coreEntityService.findOrCreatePerson(dto);
        return ResponseEntity.ok( id);
    }

    @GetMapping("/entity/all")
    List<CoreEntity> getAll(){
       return coreEntityService.getAll();
    }

    //getAllForms
    @GetMapping("/getforms")
    List<ApplicationForm> getAllForm(){
//        System.out.println(coreEntityService.getAllForms());
        return  coreEntityService.getAllForms();
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

    @DeleteMapping("/edit/form/{id}/delete")
    void deleteFormFields(@PathVariable int id){
        coreEntityService.deleteField(id);
    }

   //Get create form
    @GetMapping("/form/{id}")
    public ResponseEntity<ApplicationForm> getForm(@PathVariable int id){
        return ResponseEntity.ok(coreEntityService.getAppicationForm(id));
    }

    //This gets application Form submitted with values.
    @GetMapping("/application/{id}")
    public ResponseEntity<ApplicationFormDto> getApplicationForm(@PathVariable int id){
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
//            dto.setGovid(individual.getGovid());
//            app.setEntity(dto);
//        }
        //If company then company details
     //   System.out.println("This is the WorkflowName from the id "+ workflowFeignClient.getWorkflowName(id));
        return ResponseEntity.ok(coreEntityService.getApplicationWithDetails(id));
    }

    //get All Applications
    @GetMapping("/applicationForms")
    List<Application> getAllApplications(){
        return applicationRepo.findAll();
    }
    //attach workflow to application
    @PatchMapping("/form/{id}/workflows/map")
    void attachWorkflow(@PathVariable int id, @RequestBody WorkflowMap_Dto updatedWorkflows){

        ApplicationForm existingForm = coreEntityService.getAppicationForm(id);

        if (updatedWorkflows.getOnSubmitWorkflowId() != null) {
            existingForm.setOnSubmitWorkflowId(updatedWorkflows.getOnSubmitWorkflowId());
        }
        if (updatedWorkflows.getOnApproveWorkflowId() != null) {
            existingForm.setOnApproveWorkflowId(updatedWorkflows.getOnApproveWorkflowId());
        }
        if (updatedWorkflows.getOnRejectWorkflowId() != null) {
            existingForm.setOnRejectWorkflowId(updatedWorkflows.getOnRejectWorkflowId());
        }

        // 3. Save the form back to the database!
        coreEntityService.createForm(existingForm);
    }


    //save field value
    @PutMapping("/app/{id}/submit")
    void saveField(@PathVariable int id  ,@RequestBody SubmitApplicationRequest_Dto submitApplicationRequestDto){
//        coreEntityService.submitApplicationRequest(id,submitApplicationRequestDto);

        Application app = coreEntityService.submitApplicationRequest(id,submitApplicationRequestDto);  //coreEntityService.getApplication(id);
        System.out.println("This is application Id"+app.getApplicationForm().getId());
        Integer submitWorkflowId = app.getApplicationForm().getOnSubmitWorkflowId();

        // 3. If the Admin linked a Workflow for "Submitting", run it!
        if (submitWorkflowId != null && submitWorkflowId >0) {

            // Pack up the user's data to send to the workflow engine

            ApplicationFormDto detailsDto = coreEntityService.getApplicationWithDetails(app.getId());
            ObjectMapper mp = new ObjectMapper();
            Map<String, Object> formData = mp.convertValue(detailsDto, Map.class);
            List<Map<String, Object>> fields = (List<Map<String, Object>>) formData.get("fields");
            if (fields != null) {
                for (Map<String, Object> field : fields) {
                    field.remove("id");
                }
            }

            // NOTE: Add the actual fields you want the rules engine to evaluate!
            // formData.put("age", submitApplicationRequestDto.getAge());
            // formData.put("loanAmount", submitApplicationRequestDto.getAmount());

            // ⭐️ TRIGGER THE WORKFLOW ENGINE!
            Map<String, Object> updatedData = workflowFeignClient.executeFlowWithData(submitWorkflowId, formData);
            System.out.println("Workflow Engine Mutated Data: " + updatedData);

            // 4. Update your database with whatever the Workflow Engine altered!
            if (updatedData.containsKey("status")) {
                app.setStatus((String) updatedData.get("status"));
                // coreEntityService.saveApplication(app); // Save it back to DB!
            }
        }
    }

/*
    @PutMapping("/app/{id}/reject")
    public void rejectApplication(@PathVariable int id, @RequestBody String rejectReason) {

        Application app = coreEntityService.getApplication(id);

        // ⭐️ fetch the REJECT workflow ID (You'll need to add this field to your ApplicationForm!)
        Integer rejectWorkflowId = app.getApplicationForm().getOnRejectWorkflowId();

        if (rejectWorkflowId != null) {
            Map<String, Object> formData = new HashMap<>();
            formData.put("reason", rejectReason);

            Map<String, Object> updatedData = workflowFeignClient.executeFlowWithData(rejectWorkflowId, formData);
            System.out.println("This is the updatedData:"+ updatedData);
            // Example: updatedData might trigger a rule that sends a rejection email
            if (updatedData.containsKey("status")) {
                app.setStatus((String) updatedData.get("status"));
            }
        }
    }
*/

    @PutMapping("/app/{id}/reject")
    public Map<String, Object> rejectApplication(@PathVariable int id, @RequestBody String rejectReason) {

        Application app = coreEntityService.getApplication(id);
        Integer rejectWorkflowId = app.getApplicationForm().getOnRejectWorkflowId();
        System.out.println("THIS IS APP"+app.getApplicationForm().getStageName());
        if (rejectWorkflowId != null) {

            // ⭐️ 1. Call your existing superhero method!
            ApplicationFormDto detailsDto = coreEntityService.getApplicationWithDetails(id);
            ObjectMapper mp = new ObjectMapper();
            Map<String, Object> formData = mp.convertValue(detailsDto, Map.class);
            formData.put("rejectReason", rejectReason);

            List<Map<String, Object>> fields = (List<Map<String, Object>>) formData.get("fields");

            if (fields != null) {
                for (Map<String, Object> field : fields) {
                    field.remove("id"); // ❌ remove id
                }
            }
//            // ⭐️ 2. Loop through the DTO's fields and add them to the Map
//            for (FormFieldDto field : detailsDto.getFields()) {
//                // key = "Country", value = "India"
//                formData.put(field.getFieldName(), field.getValue());
//            }
//
//            // ⭐️ 3. Also add the Entity User Details so the workflow engine knows WHO they are!
//            if (detailsDto.getEntity() instanceof Individual_dto) {
//                Individual_dto person = (Individual_dto) detailsDto.getEntity();
//
//                formData.put("applicantFirstName", person.getFirstName());
//                formData.put("applicantLastName", person.getLastName());
//                formData.put("applicantEmail", person.getEmail());
//                formData.put("applicantGovId", person.getGovid());
//            }

            // At this point, your `formData` map has EVERYTHING.
            // Example: { "rejectReason": "Incomplete", "Country": "India", "applicantEmail": "navedshaikh..", "applicantFirstName": "Naved" }


            // 4. Send it to the engine
            Map<String, Object> updatedData = workflowFeignClient.executeFlowWithData(rejectWorkflowId, formData);
            System.out.println("THis is the update data:"+ updatedData);
            // 5. Save the updated status
//            if (updatedData.containsKey("stageName")) {
//                app.setStatus("Rejected");//((String) updatedData.get("status"));
            if (detailsDto.getFields() != null) {
                for (FormFieldDto field : detailsDto.getFields()) {
                    String fieldName = field.getFieldName();

                    // If workflow mutated this field's value, save it back
                    if (updatedData.containsKey(fieldName)) {
                        String newValue = String.valueOf(updatedData.get(fieldName));
                        System.out.println("THERE ARE THE NEW VALUES:"+newValue);
                        coreEntityService.updateFieldValue(app.getId(), fieldName, newValue);
                    }
                }
            }
                applicationRepo.save(app);
//            }
            return updatedData;
        }
        return Collections.emptyMap();
    }





}
