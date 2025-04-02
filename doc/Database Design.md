# Database Design

## Part 1
### Implementing the database tables locally
![image](https://github.com/user-attachments/assets/036ad3c1-6025-47c4-a942-2d903bc54d85)

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
        (COUNT(*) >= 2 AND SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) > SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END))
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

### 7.
### Purpose of the Query
The purpose of this query is to analyze adoption demand and pet availability across shelter locations, specifically focusing on birds and turtles. It computes the total number of adoption requests, the average pet age, and the ratio of requests per pet in each location. By combining multiple subqueries using UNION ALL and joining with aggregate data, the query offers a location-level view of both demand (requests) and supply (pets), which helps evaluate shelter performance and species popularity.

### Real-world Impact
This query is particularly useful for animal shelter administrators and strategic planners who need insights into how well different locations are managing specific animal types. It enables stakeholders to:

Identify locations with high adoption demand but potentially low pet availability.

Detect species-specific trends, such as whether birds or turtles are receiving more attention.

Assess whether shelters are oversubscribed or underutilized, based on the RequestPerPetRatio.

Prioritize resource allocation, outreach, and animal care efforts based on adoption pressure.

Make data-driven decisions on where to direct publicity or adopt-a-thon campaigns.


### SQL Concepts Used
`Join Multiple Relations + SET Operators + Aggregation via GROUP BY + Subqueries that cannot be easily replaced by a join`

### SQL Code
```
SELECT p.PetID, p.Name AS PetName,p.DateOfIntake, DATEDIFF(CURDATE(), p.DateOfIntake) AS SELECT
    combined.Location,
    SUM(combined.TotalRequests) AS TotalRequests,
    AVG(avgData.AvgPetAge) AS AvgPetAge,
    SUM(combined.TotalRequests) / NULLIF(SUM(avgData.PetCount), 0) AS RequestPerPetRatio
FROM (
    SELECT s.ShelterID, s.Location, COUNT(ar.RequestID) AS TotalRequests
    FROM Shelter s
    JOIN Pet p ON s.ShelterID = p.ShelterID
    JOIN AdoptionRequest ar ON p.PetID = ar.PetID
    WHERE p.Type = 'Bird'
    GROUP BY s.ShelterID, s.Location

    UNION ALL

    SELECT s.ShelterID, s.Location, COUNT(ar.RequestID) AS TotalRequests
    FROM Shelter s
    JOIN Pet p ON s.ShelterID = p.ShelterID
    JOIN AdoptionRequest ar ON p.PetID = ar.PetID
    WHERE p.Type = 'Turtle'
    GROUP BY s.ShelterID, s.Location
) AS combined
JOIN (
    SELECT s.ShelterID, s.Location, AVG(p.Age) AS AvgPetAge, COUNT(p.PetID) AS PetCount
    FROM Shelter s
    JOIN Pet p ON s.ShelterID = p.ShelterID
    WHERE p.Type IN ('Bird','Turtle')
    GROUP BY s.ShelterID, s.Location
) AS avgData
  ON combined.ShelterID = avgData.ShelterID
GROUP BY combined.Location
ORDER BY TotalRequests DESC;
```
### Result:
![image](https://github.com/user-attachments/assets/399780c4-1443-4bff-988c-b620212f0e57)



## Part 2
### Since the minimum requirement is 4 advanced queries. We are indexing with query 2 4 6 and 7.
### 2.

Without Index

Stream cost: 693
![image](https://github.com/user-attachments/assets/753b8ffa-99da-4a81-8f97-3bd471a6ac3c)


With Index idx_past_user ON PastAdoptionRecord(UserID)

Stream cost: 693
![image](https://github.com/user-attachments/assets/9dd8b8d4-4b21-483e-8bd0-25aff293fe58)


With Index idx_ar_user ON AdoptionRequest(UserID)

Stream cost: 986
![image](https://github.com/user-attachments/assets/89a003a4-5c60-4811-a909-628fc0024950)


With Index idx_ar_user_status_date ON AdoptionRequest(UserID, Status, RequestDate)

Stream cost: 1089
![image](https://github.com/user-attachments/assets/16965035-6c5a-40e5-864c-c00cdb6c3902)

Default (no additional index): 

Stream results cost: 693

Covering index scan on past: cost=78.5

In the default plan, the system relies on the primary key index of User, but not on any optimized index for past.UserID. This means although it performs an index scan on past, it may require accessing more rows than necessary and possibly referencing disk pages for non-covered columns.


Design 1: CREATE INDEX idx_past_user ON PastAdoptionRecord(UserID);

Stream results cost: 693

Covering index scan on past using idx_past_user: cost=79.2

The stream cost stays unchanged, indicating that the index didn’t alter the higher-level join and aggregation operations. However, the cost of scanning past slightly increased from 78.5 to 79.2, despite using a user-defined index.

This is likely due to:

The optimizer choosing the covering index idx_past_user, which may have less clustering benefit or worse row order compared to the table’s internal index or clustered PK.

Or due to more indirect lookup needed (if the covering index is not clustered and additional lookups are needed for non-indexed fields).

Design 2: CREATE INDEX idx_ar_user ON AdoptionRequest(UserID);

Stream results cost: 986

Covering index scan on past using default UserID: cost=78.5

Here, we see that stream results cost increases, possibly because the overall join ordering changed due to the optimizer preferring to access AdoptionRequest earlier or more aggressively — affecting the nested loop structure. However, the index on past is still the default and not affected, so its scan cost remains stable.

Design 3: CREATE INDEX idx_ar_user_status_date ON AdoptionRequest(UserID, Status, RequestDate); 
Stream results cost: 1089 

Covering index scan on past using default UserID: cost=78.5

This confirms a trade-off: although this composite index helps complex queries with filtering, in this case the extra index complexity might slightly increase cost or alter the join path, raising the stream result cost. The scan on past again remains unaffected since no new index was created on that table.

Justification: The covering index scan cost on past is minimally impacted by indexing unless the new index substantially changes clustering or access pattern. The stream results cost, however, is sensitive to the entire execution plan, including join order, join algorithm, and index presence across multiple tables. Adding idx_past_user did not reduce stream cost, and even slightly increased index scan cost — possibly due to the nature of the index or the storage engine’s access path decisions. Meanwhile, adding indexes to AdoptionRequest increased stream costs as the optimizer restructured the joins. Thus, for this query, indexing past.UserID offers minor benefits or even minor drawbacks, while indexing AdoptionRequest affects global plan structure — useful for filtered queries, but not necessarily optimal for simple aggregation.

### 4.
Without Index

Nested Loop inner join cost: 541 & 541
![image](https://github.com/user-attachments/assets/1dfed07b-1bbb-4e80-ac3c-fb3a5f38d9e3)


With Index idx_pet_type ON pet(type)

Nested Loop inner join cost: 167 & 169
![image](https://github.com/user-attachments/assets/e94054fa-089f-4727-9d88-0c641dab3bba)


With Index idx_pet_type_age ON pet(type, age)

Nested Loop inner join cost: 322 & 370
![image](https://github.com/user-attachments/assets/fd57e4d7-c65a-44ec-97a1-d1990222c7f8)


With Index idx_pet_type ON pet(type) & idx_Shelter_name on Shelter(name) & idx_ar_status on AdoptionRequest(status)

Nested Loop inner join cost: 562 & 562
![image](https://github.com/user-attachments/assets/c7b04181-8b93-4e40-9acd-01fa6214d62f)
Default (No Additional Indexes):Without any indexes on non‑primary/foreign key columns, the query must perform full table scans to filter rows on Pet.Type, join with Shelter, and filter AdoptionRequest by status. 


Design 1: With Index idx_pet_type on Pet(Type) hat It Does:

This index speeds up the filtering on Pet.Type. When the query applies a WHERE condition on pet type (e.g., 'Cat' or 'Dog'), the database engine can quickly locate matching rows using the index instead of scanning the entire table.We can see that Fewer rows need to be checked, which lowers the overall cost. And The join from Pet to AdoptionRequest and Shelter is faster because fewer rows from Pet are passed on.

Design2 :. With Composite Index idx_pet_type_age on Pet(Type, Age) This composite index covers both Type and Age. It’s intended to help if  filter on both columns. This still yields improvement comparing to the default, however the composite index slows join operation and scaning. The Age column isn’t highly selective for this query (i.e., many rows share the same Age), the extra column doesn’t help much.
The simpler index on Type is smaller and faster to scan, matching the query’s primary filtering need. In the tests, the 2nd scenario (index on Type only) performed better than the composite index on (Type, Age) because many rpets share the same Age, the new index does not narrow things down and the simpler index in design 2 is smaller, faster to traverse, and  meets the filtering need better. 

Design 3: CREATE INDEX idx_pet_type ON Pet(Type); CREATE INDEX idx_Shelter_name ON Shelter(Name); CREATE INDEX idx_ar_status ON AdoptionRequest(Status); This setup introduces an index on Shelter.Name, which is used only for SELECT and GROUP BY, and one on AdoptionRequest.Status, which helps the subquery filter requests with Status IN ('Pending', 'Approved'). While this adds benefit by slightly speeding up the subquery evaluation, it doesn't help filtering Pet by Age, and the use of a separate idx_pet_type is not as powerful as idx_pet_type_age. As a result, although the total actual execution time is better than the default , it's slightly worse than Design 2 and considerably worse than design 1.

Justification: Among the tested strategies, the simple index on Pet(Type) (Design 1) is superior because it directly targets the most selective filtering criterion in the query, dramatically reducing the number of scanned rows via an efficient index range scan. In contrast, adding Age in a composite index on Pet(Type, Age) increases the index size and overhead without providing additional selectivity because the original filtering is already quite fast and adding index for age of pets yields little benefit, with the added overhead together resulting in a slightly higher cost. Furthermore, the multi-index approach in Design 3, which adds indexes on Shelter(Name) and AdoptionRequest(Status) along with Pet(Type), further increases overhead and join costs because these extra columns are not sufficiently selective to meaningfully narrow the dataset. Overall, the focused index on Pet(Type) achieves the best performance by aligning precisely with the query’s WHERE clause, while additional indexes add unnecessary overhead and worsen execution cost.


### 6. 
Without Index: 24413
![9777528d5f2b168556705e2c3f01867](https://github.com/user-attachments/assets/2fdbe482-20b6-46b0-91ec-8fd14fa222f4)

With Index idx_mr_petid_date ON MedicalRecord(PetID, Date DESC): 24473
![29e9a9253057cfc4bcb4cb53610ba28](https://github.com/user-attachments/assets/0ac4e0ae-bf96-4c50-a159-cddb30db5e33)

With Index idx_mr_petid_maxdate ON MedicalRecord(PetID, Date): 24398
![90bcf0141314f0d53b3d4b61ff28eb8](https://github.com/user-attachments/assets/f613febf-5406-4beb-89d0-c31712477277)

With Index idx_pet_petid ON Pet(PetID) & idx_latestmr_petid ON MedicalRecord(PetID): 24418
![5fe4d8bdce0a069a7c5c6e4364a9fc7](https://github.com/user-attachments/assets/0aca1af9-c76a-4659-b55a-154d0cdd2128)

Default (no additional index): The query performs multiple nested loop joins and scans without any support from indexes. As shown in the first screenshot, the inner join operations over MedicalRecord and the grouping step had higher costs and longer execution times due to full table scans.

Design 1: CREATE INDEX idx_mr_petid_date ON MedicalRecord(PetID, Date DESC); This composite index directly supports both the join condition and the MAX(Date) grouping. It improves performance significantly by enabling index skip scans for grouping and minimizing lookup cost. This is evident in the reduced materialization and group aggregate cost seen in the second screenshot.

Design 2: CREATE INDEX idx_mr_petid_maxdate ON MedicalRecord(PetID, Date); This design aims to support the deduplication and join logic for finding the latest records more directly. It also enables the system to use a covering index for the materialized subquery. However, it shows slightly higher cost and execution time for the grouping phase than the previous index, possibly due to less optimization support for skip scans during aggregation.

Design 3: CREATE INDEX idx_pet_petid ON Pet(PetID); CREATE INDEX idx_latestmr_petid ON MedicalRecord(PetID); Functionally identical to the first custom index but created under a different name to test consistency. Performance remained nearly the same, confirming that the structure of the index matters more than the label.

Justification: Among all designs, the composite index (PetID, Date) consistently provided the best balance between efficient lookup and aggregation. It enabled covering index scans and skip scans, which reduced the overhead of joining and grouping in nested subqueries. This improvement is particularly noticeable given the relatively large size of the MedicalRecord table. Indexing PetID alone would not suffice because the optimizer would still need to search through all rows with the same PetID to find the max Date. Adding Date as a secondary column allows the optimizer to use tree-structured lookups and skip scans more effectively. This case highlights how a well-designed composite index can drastically reduce query cost and execution time in multi-level nested queries.


### 7. 
Without index:
![68b4bd37eb8cb37283f6106eb685238](https://github.com/user-attachments/assets/f7e35cd4-9a0c-4ee4-91e9-765e1678cca4)
With Index idx_pet_type ON Pet(Type):
![a96102c6499f7df45fa12f6b02eb451](https://github.com/user-attachments/assets/af04a811-e83b-4753-8c46-be0a99b46fb3)
With Index idx_shelter_location ON Shelter(Location):
![a88f2219aa4c24e1ded6282d5d97da3](https://github.com/user-attachments/assets/50c6ade3-2e40-499c-9b71-e1af766beb70)
With Index idx_pet_type ON Pet(Type) & idx_shelter_location ON Shelter(Location):
![426573a3ff9cdf0b5a35778c40a2b63](https://github.com/user-attachments/assets/edfe1f4f-17df-4008-97d7-ddf8764bcece)


Default (no additional index): The query performs full table scans on the Pet and Shelter tables in both the UNION ALL branches. Filtering by Pet.Type is done without any supporting index, and aggregation is handled through temporary tables. The join between the subqueries (combined and avgData) relies on standard nested loop joins. As a result, execution cost remains high, with the main aggregation step in the outer query costing 846 and the Pet filtering costing 504.

Design 1: CREATE INDEX idx_pet_type ON Pet(Type); This single-column index improves filtering on Pet.Type for the 'Turtle' branch. In the plan, the cost of the nested loop involving turtle-type pets drops to 1.07, and the specific filtering step on Pet.Type = 'Turtle' now has a reduced cost of 0.35. However, the 'Bird' branch still relies on full scans, and since Pet.Age and join columns are not indexed, aggregation and lookups remain costly.

Design 2: CREATE INDEX idx_shelter_location ON Shelter(Location); This index targets the GROUP BY combined.Location and GROUP BY avgData.Location clauses.  This indexing has the same intention as Design 1. However, because the query still filter by ShelterID, and that the number of unique locations is nearly as high as the number of shelters, this index offers only minimal improvement. The main join still uses ShelterID (the primary key), so most cost-intensive steps remain unchanged compared to the default plan. The execution cost in major steps remains almost identical to the default. This shows that indexing on GROUP BY attributes alone, without filtering or join involvement, yields minimal performance gain.

Design 3: CREATE INDEX idx_pet_type ON Pet(Type); + CREATE INDEX idx_shelter_location ON Shelter(Location); This combination improves both Pet filtering and potentially speeds up access to shelter locations during grouping. The 'Bird' and 'Turtle' branches both benefit from the Pet.Type index, and the optimizer uses index range scans with a cost of 0.132 for filtering (p.Type IN ('Bird','Turtle')). Aggregation cost on the avgData subquery also improves due to better access paths. Overall, the combined effect yields a notable cost reduction in filtering and aggregation compared to all prior versions.

Justification:
Among the four designs, Design 3 (with idx_pet_type and idx_shelter_location) provides the most comprehensive performance improvement. While indexing Shelter.Location alone has little effect, combining it with Pet.Type allows both filtering and grouping operations to benefit. This leads to reduced cost in filtering individual pet types (cost 0.132) and optimized joins and aggregations. In contrast, Design 1 only helps with one branch of the union, and Design 2 doesn’t significantly influence performance. This demonstrates that multi-index strategies that align with both WHERE and GROUP BY clauses are more effective than isolated or misaligned indexes.
