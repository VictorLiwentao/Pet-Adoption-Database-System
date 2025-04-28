CREATE TABLE IF NOT EXISTS AdoptionStatistics (
    ShelterID INT,
    PetType VARCHAR(20),
    TotalAdoptions INT DEFAULT 0,
    TotalRequests INT DEFAULT 0,
    LastUpdated DATETIME,
    PRIMARY KEY (ShelterID, PetType),
    FOREIGN KEY (ShelterID) REFERENCES Shelter(ShelterID) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER AfterAdoptionStatusChange
AFTER UPDATE ON AdoptionRequest
FOR EACH ROW
BEGIN
    DECLARE v_shelterID INT;
    DECLARE v_petType VARCHAR(20);
    
    IF OLD.Status != NEW.Status AND NEW.Status = 'Approved' THEN
        SELECT p.Type, p.ShelterID INTO v_petType, v_shelterID
        FROM Pet p
        WHERE p.PetID = NEW.PetID;
        
        IF v_petType IS NOT NULL AND v_shelterID IS NOT NULL THEN
            UPDATE AdoptionStatistics
            SET 
                TotalAdoptions = TotalAdoptions + 1,
                LastUpdated = NOW()
            WHERE ShelterID = v_shelterID AND PetType = v_petType;
            
            IF ROW_COUNT() = 0 THEN
                INSERT INTO AdoptionStatistics (
                    ShelterID, 
                    PetType, 
                    TotalAdoptions,
                    TotalRequests,
                    LastUpdated
                )
                VALUES (
                    v_shelterID,
                    v_petType,
                    1,
                    1,
                    NOW()
                );
            END IF;
        END IF;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER AfterNewAdoptionRequest
AFTER INSERT ON AdoptionRequest
FOR EACH ROW
BEGIN
    DECLARE v_shelterID INT;
    DECLARE v_petType VARCHAR(20);
    
    SELECT p.Type, p.ShelterID INTO v_petType, v_shelterID
    FROM Pet p
    WHERE p.PetID = NEW.PetID;
    
    IF v_petType IS NOT NULL AND v_shelterID IS NOT NULL THEN
        UPDATE AdoptionStatistics
        SET 
            TotalRequests = TotalRequests + 1,
            LastUpdated = NOW()
        WHERE ShelterID = v_shelterID AND PetType = v_petType;
        
        IF ROW_COUNT() = 0 THEN
            INSERT INTO AdoptionStatistics (
                ShelterID, 
                PetType, 
                TotalAdoptions,
                TotalRequests,
                LastUpdated
            )
            VALUES (
                v_shelterID,
                v_petType,
                0,
                1,
                NOW()
            );
        END IF;
    END IF;
END //
DELIMITER ;