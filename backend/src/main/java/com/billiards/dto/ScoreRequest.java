package com.billiards.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScoreRequest {
    @NotNull(message = "Winner ID is required")
    private Long winnerId;

    @NotNull(message = "Loser ID is required")
    private Long loserId;

    @NotNull(message = "Ball number is required")
    private Integer ballNumber; // 3, 6, or 9
}
