# Database Design

## Part 1

### DDL Commands
```
CREATE TABLE User (
    UserID INT PRIMARY KEY,
    Name VARCHAR(50),
    Email VARCHAR(50) UNIQUE,
    Password VARCHAR(100),
    PhoneNumber VARCHAR(20)
);

CREATE TABLE Shelter (
    ShelterID INT PRIMARY KEY,
    Name VARCHAR(50),
    Location VARCHAR(100),
    Email VARCHAR(50) UNIQUE,
    PhoneNumber VARCHAR(20),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Pet (
    PetID INT PRIMARY KEY,
    ShelterID INT,
    Name VARCHAR(50),
    Type VARCHAR(20),
    Breed VARCHAR(50),
    Age INT,
    Size VARCHAR(20),
    Color VARCHAR(50),
    Sex VARCHAR(10),
    ImageURL VARCHAR(200),
    DateOfIntake DATE,
    FOREIGN KEY (ShelterID) REFERENCES Shelter(ShelterID),
);

CREATE TABLE Status (
    StatusID INT PRIMARY KEY,
    Label VARCHAR(20),
    Description TEXT
);

CREATE TABLE AdoptionRequest (
    RequestID INT PRIMARY KEY,
    UserID INT,
    PetID INT,
    RequestDate DATE,
    StatusID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PetID) REFERENCES Pet(PetID),
    FOREIGN KEY (StatusID) REFERENCES Status(StatusID)
);
```
