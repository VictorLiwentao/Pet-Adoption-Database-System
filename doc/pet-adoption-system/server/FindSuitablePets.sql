DROP PROCEDURE IF EXISTS FindSuitablePets;
DELIMITER //
CREATE PROCEDURE FindSuitablePets(
    IN p_petType VARCHAR(20),
    IN p_maxAge INT,
    IN p_size VARCHAR(20)
)
BEGIN
    SELECT p.*, s.Name AS ShelterName, COUNT(m.RecordID) AS MedicalRecordCount
    FROM Pet p
    JOIN Shelter s ON p.ShelterID = s.ShelterID
    LEFT JOIN MedicalRecord m ON p.PetID = m.PetID
    WHERE p.Type = p_petType 
      AND p.Age <= p_maxAge
      AND (p_size = '' OR p.Size = p_size)
      AND NOT EXISTS (
          SELECT 1 FROM AdoptionRequest ar 
          WHERE ar.PetID = p.PetID 
          AND ar.Status IN ('Pending', 'Approved')
      )
    GROUP BY p.PetID, p.Name, p.Type, p.Breed, p.Age, p.Size, p.Color, p.Sex, 
             p.DateOfIntake, p.ShelterID, s.Name
    ORDER BY p.Age ASC, MedicalRecordCount ASC;
    
    -- Advanced query 2: Find shelters with the most pets of the requested type
    SELECT s.ShelterID, s.Name AS ShelterName, s.Location, COUNT(p.PetID) AS PetCount
    FROM Shelter s
    JOIN Pet p ON s.ShelterID = p.ShelterID
    WHERE p.Type = p_petType
    GROUP BY s.ShelterID, s.Name, s.Location
    HAVING COUNT(p.PetID) > 0
    ORDER BY PetCount DESC
    LIMIT 3;
END //
DELIMITER ;