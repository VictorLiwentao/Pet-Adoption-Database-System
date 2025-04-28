DROP PROCEDURE IF EXISTS ProcessAdoptionRequest;
DELIMITER //
CREATE PROCEDURE ProcessAdoptionRequest(
    IN p_requestID INT,
    IN p_status VARCHAR(20)
)
BEGIN
    -- Declare variables
    DECLARE v_petID INT;
    DECLARE v_userID INT;
    DECLARE v_count INT DEFAULT 0;
    
    -- For handling exceptions
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error occurred. Transaction rolled back.' AS Message;
    END;
    
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;
    
    SELECT ar.PetID, ar.UserID 
    INTO v_petID, v_userID
    FROM AdoptionRequest ar
    JOIN Pet p ON ar.PetID = p.PetID
    WHERE ar.RequestID = p_requestID;
    
    IF v_petID IS NULL THEN
        SELECT 'Adoption request not found' AS Message;
        ROLLBACK;
    ELSE
        SELECT COUNT(*) INTO v_count
        FROM AdoptionRequest
        WHERE PetID = v_petID 
          AND Status = 'Approved'
          AND RequestID != p_requestID;
        
        IF v_count > 0 AND p_status = 'Approved' THEN
            UPDATE AdoptionRequest 
            SET Status = 'Rejected'
            WHERE RequestID = p_requestID;
            
            SELECT 'Request rejected - pet already adopted' AS Message;
        ELSE
            UPDATE AdoptionRequest
            SET Status = p_status
            WHERE RequestID = p_requestID;
            
            IF p_status = 'Approved' THEN
                UPDATE AdoptionRequest
                SET Status = 'Rejected'
                WHERE PetID = v_petID
                  AND Status = 'Pending'
                  AND RequestID != p_requestID;
                
                INSERT INTO PastAdoptionRecord (
                    RecordID, 
                    UserID, 
                    DateOfAdoption, 
                    PetType
                )
                SELECT 
                    FLOOR(RAND() * 1000000), 
                    v_userID,
                    CURDATE(),
                    p.Type
                FROM Pet p
                WHERE p.PetID = v_petID;
                
                SELECT 'Adoption approved and recorded successfully' AS Message;
            ELSE
                SELECT CONCAT('Request updated to ', p_status) AS Message;
            END IF;
        END IF;
    END IF;
    
    COMMIT;
END //
DELIMITER ;