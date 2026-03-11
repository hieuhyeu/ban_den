package com.billiards.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlayerDTO {
    private Long id;

    @NotBlank(message = "Player name is required")
    private String name;

    private Integer score;
    private String createdAt;
}
