DROP PROCEDURE IF EXISTS FindSeniorPetsNeedingAdoption;
DELIMITER //
CREATE PROCEDURE FindSeniorPetsNeedingAdoption()
BEGIN
    (SELECT S.ShelterID, S.Name AS ShelterName, P.Type AS PetType, COUNT(P.PetID) AS AvailablePetCount
    FROM Shelter S
    JOIN Pet P ON S.ShelterID = P.ShelterID
    WHERE P.Type = 'Cat'
    AND P.Age >= 10
    AND NOT EXISTS (
            SELECT 1
            FROM AdoptionRequest AR
            WHERE AR.PetID = P.PetID
              AND AR.Status IN ('Pending', 'Approved')
        )
    GROUP BY S.ShelterID, S.Name, P.Type)

    UNION

    (SELECT S.ShelterID, S.Name AS ShelterName, P.Type AS PetType, COUNT(P.PetID) AS AvailablePetCount
    FROM Shelter S
    JOIN Pet P ON S.ShelterID = P.ShelterID
    WHERE P.Type = 'Dog'
    AND P.Age > 8
    AND NOT EXISTS (
            SELECT 1
            FROM AdoptionRequest AR
            WHERE AR.PetID = P.PetID
              AND AR.Status IN ('Pending', 'Approved')
        )
    GROUP BY S.ShelterID, S.Name, P.Type)

    ORDER BY AvailablePetCount DESC;
END //
DELIMITER ;