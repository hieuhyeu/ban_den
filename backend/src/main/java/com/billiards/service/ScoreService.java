package com.billiards.service;

import com.billiards.dto.ScoreHistoryDTO;
import com.billiards.dto.ScoreRequest;
import com.billiards.model.Player;
import com.billiards.model.ScoreHistory;
import com.billiards.repository.PlayerRepository;
import com.billiards.repository.ScoreHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final PlayerRepository playerRepository;
    private final ScoreHistoryRepository scoreHistoryRepository;

    private static final Map<Integer, Integer> BALL_POINTS = Map.of(
            3, 1,
            6, 2,
            9, 3
    );

    @Transactional
    public ScoreHistoryDTO recordScore(ScoreRequest request) {
        // Validate ball number
        Integer points = BALL_POINTS.get(request.getBallNumber());
        if (points == null) {
            throw new RuntimeException("Invalid ball number: " + request.getBallNumber() + ". Must be 3, 6, or 9.");
        }

        // Validate players
        if (request.getWinnerId().equals(request.getLoserId())) {
            throw new RuntimeException("Winner and loser cannot be the same player.");
        }

        Player winner = playerRepository.findById(request.getWinnerId())
                .orElseThrow(() -> new RuntimeException("Winner player not found"));
        Player loser = playerRepository.findById(request.getLoserId())
                .orElseThrow(() -> new RuntimeException("Loser player not found"));

        // Update scores (zero-sum)
        winner.setScore(winner.getScore() + points);
        loser.setScore(loser.getScore() - points);

        playerRepository.save(winner);
        playerRepository.save(loser);

        // Save history
        ScoreHistory history = ScoreHistory.builder()
                .winner(winner)
                .loser(loser)
                .ballNumber(request.getBallNumber())
                .points(points)
                .build();
        ScoreHistory saved = scoreHistoryRepository.save(history);

        return toDTO(saved);
    }

    public List<ScoreHistoryDTO> getHistory() {
        return scoreHistoryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void undoLastScore(Long historyId) {
        ScoreHistory history = scoreHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Score history not found"));

        Player winner = history.getWinner();
        Player loser = history.getLoser();

        // Reverse the score
        winner.setScore(winner.getScore() - history.getPoints());
        loser.setScore(loser.getScore() + history.getPoints());

        playerRepository.save(winner);
        playerRepository.save(loser);

        scoreHistoryRepository.delete(history);
    }

    private ScoreHistoryDTO toDTO(ScoreHistory h) {
        return ScoreHistoryDTO.builder()
                .id(h.getId())
                .winnerName(h.getWinner().getName())
                .winnerId(h.getWinner().getId())
                .loserName(h.getLoser().getName())
                .loserId(h.getLoser().getId())
                .ballNumber(h.getBallNumber())
                .points(h.getPoints())
                .createdAt(h.getCreatedAt().toString())
                .build();
    }
}
