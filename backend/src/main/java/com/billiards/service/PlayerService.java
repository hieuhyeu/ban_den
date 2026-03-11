package com.billiards.service;

import com.billiards.dto.PlayerDTO;
import com.billiards.model.Player;
import com.billiards.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAllByOrderByCreatedAtAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PlayerDTO createPlayer(PlayerDTO dto) {
        Player player = Player.builder()
                .name(dto.getName())
                .score(0)
                .build();
        Player saved = playerRepository.save(player);
        return toDTO(saved);
    }

    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Player not found with id: " + id);
        }
        playerRepository.deleteById(id);
    }

    private PlayerDTO toDTO(Player player) {
        PlayerDTO dto = new PlayerDTO();
        dto.setId(player.getId());
        dto.setName(player.getName());
        dto.setScore(player.getScore());
        dto.setCreatedAt(player.getCreatedAt().toString());
        return dto;
    }
}
