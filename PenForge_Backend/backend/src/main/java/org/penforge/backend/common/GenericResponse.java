package org.penforge.backend.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class GenericResponse<T> {

    private int code;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;
}