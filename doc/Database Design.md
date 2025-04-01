# Database Design

## Part 1
### Implementing the database tables locally
![image](https://github.com/user-attachments/assets/92597562-5b5f-436f-b88b-68fd167987b5)

### DDL Commands
```
CREATE TABLE User (
    UserID INT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL
);

CREATE TABLE Shelter (
    ShelterID INT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    Email VARCHAR(50) UNIQUE,
    PhoneNumber VARCHAR(20) NOT NULL,
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE Pet (
    PetID INT PRIMARY KEY,
    ShelterID INT,
    Name VARCHAR(50) NOT NULL,
    Type VARCHAR(20) NOT NULL,
    Breed VARCHAR(50) NOT NULL,
    Age INT NOT NULL,
    Size VARCHAR(20) NOT NULL,
    Color VARCHAR(50) NOT NULL,
    Sex VARCHAR(10) NOT NULL,
    DateOfIntake DATE NOT NULL,
    FOREIGN KEY (ShelterID) REFERENCES Shelter(ShelterID) ON DELETE CASCADE
);

CREATE TABLE AdoptionRequest (
    RequestID INT PRIMARY KEY,
    UserID INT,
    PetID INT,
    RequestDate DATE NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pet(PetID) ON DELETE CASCADE
);

CREATE TABLE MedicalRecord (
    RecordID INT PRIMARY KEY,
    PetID INT,
    Date DATE NOT NULL,
    Description TEXT NOT NULL,
    VetName VARCHAR(50) NOT NULL,
    FOREIGN KEY (PetID) REFERENCES Pet(PetID) ON DELETE CASCADE
);

CREATE TABLE PastAdoptionRecord (
    RecordID INT PRIMARY KEY,
    UserID INT,
    DateOfAdoption DATE NOT NULL,
    PetType VARCHAR(20) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);
```
All data in the data folder is added to the schema.

![image](https://github.com/user-attachments/assets/ad753648-87a0-4411-8fed-366530d17c06)

## Advanced SQL queries:
### 1. 
### Purpose of the Query
The goal of this query is to determine how many adoption requests each shelter has received, by counting all the requests submitted for pets associated with each shelter.
### Real-world Impact
This query provides valuable operational insight for shelter management. It helps identify which shelters are attracting the most interest from potential adopters. Such data can be used to:

Evaluate and improve marketing effectiveness

Allocate resources more efficiently (e.g., staff, funding, veterinary care)

Understand adoption demand patterns across locations

Recognize shelters that may need additional support due to low engagement
### SQL Concepts Used
`Join Multiple Relations + Aggregation via GROUP BY`
### SQL Code
```
SELECT s.Name AS ShelterName, s.Email,s.Location, COUNT(ar.RequestID) AS TotalRequests
FROM Shelter s
JOIN Pet p ON s.ShelterID = p.ShelterID
JOIN AdoptionRequest ar ON p.PetID = ar.PetID
GROUP BY s.ShelterID
ORDER BY TotalRequests DESC;
```
### Result:
![image](https://github.com/user-attachments/assets/730b1a7e-7fc5-4fd8-aaa7-55c63e0677a0)

### 2.
### Purpose of the Query
The goal of this query is to analyze user behavior by determining how many past adoptions and current adoption requests each user has made. It tracks both historical engagement (confirmed adoptions) and current interest (open requests), providing a dual-perspective view of user activity.
### Real-world Impact
This query is useful for understanding the most active and engaged adopters.
Shelters or administrators can use this data to:

Identify loyal or frequent adopters

Target them for outreach, special events, or feedback

Recognize users with ongoing interest who have a strong history of successful adoptions

Provide a more personalized adoption experience
### SQL Concepts Used
`Join Multiple Relations + Aggregation via GROUP BY`
### SQL Code
```
SELECT u.UserID, u.Name, COUNT(DISTINCT past.RecordID) AS PastAdoptions, COUNT(DISTINCT ar.RequestID) AS CurrentRequests
FROM User u
JOIN PastAdoptionRecord past ON u.UserID = past.UserID
JOIN AdoptionRequest ar ON u.UserID = ar.UserID
GROUP BY u.UserID, u.Name
ORDER BY PastAdoptions, CurrentRequests DESC;
```
### Result:
![image](https://github.com/user-attachments/assets/efa12162-597d-4b27-8a0b-ab5f67583347)

P.S. Since only 15 rows are shown, the past adoption is only 1. The actual ascending order will be followed by a different number.

### 3.
### Purpose of the Query
The goal of this query is to analyze the adoption demand for each type of pet in each shelter, by counting how many adoption requests were made for each pet type at every shelter.
### Real-world Impact
This query helps shelter managers and system administrators:

Understand which types of pets are in higher demand within each shelter.

Compare adoption interest across different shelters for targeted promotions (e.g., “Cats most requested at Shelter A”).

Make data-driven decisions about resource allocation (e.g., space, food, medical care) depending on adoption demand by type.

Identify opportunities for marketing campaigns or events around under-requested pet types.
### SQL Concepts Used
`Join Multiple Relations + Aggregation via GROUP BY`
### SQL Code
```
SELECT s.ShelterID, s.Name AS ShelterName, p.Type AS PetType, COUNT(ar.RequestID) AS RequestsForType
FROM Shelter s
JOIN Pet p ON s.ShelterID = p.ShelterID
JOIN AdoptionRequest ar ON ar.PetID = p.PetID
GROUP BY s.ShelterID, s.Name, p.Type
ORDER BY s.ShelterID, RequestsForType DESC;
```
### Result:
![image](https://github.com/user-attachments/assets/02a0890a-6f91-438c-ad82-a55f67abd14a)

### 4.
### Purpose of the Query
The goal of this query is to identify shelters that currently have senior cats (age ≥ 10) or senior dogs (age > 8) available for adoption, and to rank these shelters by the number of such pets. Only pets not currently involved in pending or approved adoption requests are included.

### Real-world Impact
This query is especially valuable for helping shelters promote the adoption of senior animals, who often face longer shelter stays. It allows:

Animal welfare advocates to prioritize outreach to shelters with the largest number of senior pets.

Shelters to identify surplus of elderly pets and create targeted campaigns (e.g., "Adopt a Senior Pet Week").

System admins to generate real-time dashboards showing available high-priority animals (those aging and still unclaimed).

It also supports humane decision-making by spotlighting pets who are most in need of placement.
### SQL Concepts Used
`Join Multiple Relations + SET Operators + Aggregation via GROUP BY + Subqueries that cannot be easily replaced by a join`
### SQL Code
```
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
```
### Result:
![image](https://github.com/user-attachments/assets/c3c7b541-302c-4169-b159-a74db818855f)

### 5 
### Purpose of the Query
The goal of this query is to identify users who exhibit potentially problematic adoption request behavior, such as submitting a high number of recent requests or having more rejected than approved requests overall. It also returns how many of their requests were approved and how many were rejected.

### Real-world Impact
This query is valuable for platform administrators and shelter managers who want to:

Detect users who may be abusing or misunderstanding the adoption request process.

Flag accounts for review if the user is overly aggressive with requests (e.g., submitting > 4 in a month).

Spot users who are consistently denied, which may indicate compatibility issues or system misuse.

Provide customer support or educational outreach to users struggling to complete the adoption process.

This can help maintain the integrity of the platform and improve the quality of the adoption matching system.

### SQL Concepts Used
`Join Multiple Relations + Aggregation via GROUP BY + Subqueries that cannot be easily replaced by a join`
### SQL Code
```
SELECT u.UserID, u.Name, u.Email, stats.ApprovedCount,stats.RejectedCount
FROM User u
JOIN (
    SELECT UserID,SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END) AS ApprovedCount,SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS RejectedCount
    FROM AdoptionRequest
    GROUP BY UserID
    HAVING (SUM(CASE WHEN RequestDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) > 4)
        OR
        (COUNT(*) >= 2AND SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) > SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END))
) AS stats ON u.UserID = stats.UserID
ORDER BY stats.RejectedCount DESC;
```
### Result:
![image](https://github.com/user-attachments/assets/491a8cfd-970a-4946-b366-2b01d487bd74)

### 6
### Purpose of the Query
The goal of this query is to display how long each pet has been in the shelter and show the details of their most recent medical record (if any). It calculates the number of days each pet has stayed in the shelter and joins that with the latest veterinary record available for that pet.

### Real-world Impact
This query is highly useful for shelter staff and administrators because it:

Helps identify pets that have been in the shelter the longest, who may need prioritization in marketing or adoption efforts.

Displays each pet’s most recent medical history, allowing for quick access to important health information without manually browsing through multiple records.

Supports veterinary planning and adoption readiness assessment, especially for animals with outdated or missing medical records.

Can be used to create dashboards highlighting pets overdue for medical updates or shelter exit strategies.

### SQL Concepts Used
`Join Multiple Relations + Aggregation via GROUP BY + Subqueries that cannot be easily replaced by a join`
### SQL Code
```
SELECT p.PetID, p.Name AS PetName,p.DateOfIntake, DATEDIFF(CURDATE(), p.DateOfIntake) AS DaysInShelter, latestMR.LatestRecordDate, latestMR.Description, latestMR.VetName
FROM Pet p
LEFT JOIN (
    SELECT m1.PetID,m1.Date AS LatestRecordDate,m1.Description,m1.VetName
    FROM MedicalRecord m1
    JOIN (
        SELECT PetID, MAX(Date) AS MaxDate
        FROM MedicalRecord
        GROUP BY PetID
    ) m2 ON m1.PetID = m2.PetID AND m1.Date = m2.MaxDate
) AS latestMR ON p.PetID = latestMR.PetID
ORDER BY DaysInShelter DESC, LatestRecordDate ASC;
```
### Result:
![image](https://github.com/user-attachments/assets/d47ea8e0-aa0e-4e32-958b-4bc2f9117a63)

P.S. Because some pets may not have vaccination records, they are null. these are the first targets to be considered for needing vaccinations.
