package mx.edu.utez.healthcare.repository;

import mx.edu.utez.healthcare.model.HabitRecord;
import mx.edu.utez.healthcare.model.HabitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface HabitRecordRepository extends JpaRepository<HabitRecord, Long> {
    List<HabitRecord> findByUserIdAndRecordDate(Long userId, LocalDate date);
    List<HabitRecord> findByUserIdAndRecordDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(h.value), 0) FROM HabitRecord h WHERE h.user.id = :userId AND h.habitType = :habitType AND h.recordDate = :date")
    Double getSumValueByUserIdAndHabitTypeAndRecordDate(Long userId, HabitType habitType, LocalDate date);
}