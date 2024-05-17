package org.penforge.backend.registeration;

import lombok.AllArgsConstructor;
import org.penforge.backend.common.GenericResponse;
import org.penforge.backend.user.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping(path="api/v1/registration")
public class RegistrationController {


    private RegistrationService registrationService;

    @PostMapping()
    public GenericResponse<String> register(@RequestBody RegistrationRequest request){
        try{

            registrationService.register(request);
            return new GenericResponse<String>().setCode(200).setData("CREATED");
        }catch (Exception e){
            return new GenericResponse<String>().setCode(400).setData("CANNOT CREATED");
        }



    }
}
