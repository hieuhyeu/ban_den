package com.billiards.controller;

import com.billiards.dto.ScoreHistoryDTO;
import com.billiards.dto.ScoreRequest;
import com.billiards.service.ScoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    @PostMapping
    public ResponseEntity<ScoreHistoryDTO> recordScore(@Valid @RequestBody ScoreRequest request) {
        return ResponseEntity.ok(scoreService.recordScore(request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ScoreHistoryDTO>> getHistory() {
        return ResponseEntity.ok(scoreService.getHistory());
    }

    @DeleteMapping("/undo/{id}")
    public ResponseEntity<Void> undoScore(@PathVariable Long id) {
        scoreService.undoLastScore(id);
        return ResponseEntity.noContent().build();
    }
}
