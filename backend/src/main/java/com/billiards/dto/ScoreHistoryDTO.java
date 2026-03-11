package com.billiards.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreHistoryDTO {
    private Long id;
    private String winnerName;
    private Long winnerId;
    private String loserName;
    private Long loserId;
    private Integer ballNumber;
    private Integer points;
    private String createdAt;
}
