package mx.edu.utez.healthcare.repository;


import mx.edu.utez.healthcare.model.Goal;
import mx.edu.utez.healthcare.model.HabitType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserId(Long userId);
    Optional<Goal> findByUserIdAndHabitType(Long userId, HabitType habitType);
}