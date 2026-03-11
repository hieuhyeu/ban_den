package com.billiards.repository;

import com.billiards.model.ScoreHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScoreHistoryRepository extends JpaRepository<ScoreHistory, Long> {
    List<ScoreHistory> findAllByOrderByCreatedAtDesc();
}
