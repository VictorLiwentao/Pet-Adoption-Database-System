# Database Design

## Part 1

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

ORDER BY AvailablePetCount DESC
```
### Result:
![image](https://github.com/user-attachments/assets/c3c7b541-302c-4169-b159-a74db818855f)
