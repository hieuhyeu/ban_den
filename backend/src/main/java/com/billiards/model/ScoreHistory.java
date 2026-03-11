package com.billiards.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "score_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "winner_id", nullable = false)
    private Player winner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loser_id", nullable = false)
    private Player loser;

    @Column(name = "ball_number", nullable = false)
    private Integer ballNumber;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
