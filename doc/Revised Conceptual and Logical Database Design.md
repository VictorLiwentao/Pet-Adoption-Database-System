## **UML Image**
![Pet Adoption (9)](https://github.com/user-attachments/assets/8637f36d-11b2-4d91-a0fa-67bf6e66c630)



## **Entities and Assumptions**

### **1. User**
#### **Assumptions**
- The **User** entity represents all people using the system.
- The **UserID** is the primary key, ensuring unique identification.
- **PhoneNumber** is included for communication purposes.

#### **Attributes**
- `UserID: INT [PK]` - Unique identifier for each user.
- `Name: VARCHAR(50)` - Full name of the user.
- `Email: VARCHAR(50) UNIQUE` - Ensures each user has a distinct email for authentication.
- `Password: VARCHAR(100)` - Hashed password for security.
- `PhoneNumber: VARCHAR(20)` - Contact number of the user.

#### **Relationships**
- **User → Adoption_Request (0 → *)**: A user may submit many adoption requests.
- **User → Past_Adoption_Record (0 → *)**: A user may have past adoption records.

---

### **2. Shelter**
#### **Assumptions**
- A **Shelter** represents a pet adoption center that houses multiple pets.
- Each **Shelter** is managed by exactly **one User**.
- Each **Shelter** can have multiple **Pets**.

#### **Attributes**
- `ShelterID: INT [PK]` - Unique identifier for the shelter.
- `Name: VARCHAR(50)` - Shelter’s name.
- `Location: VARCHAR(100)` - Address of the shelter.
- `Email: VARCHAR(50) UNIQUE` - Contact email of the shelter.
- `PhoneNumber: VARCHAR(20)` - Contact number of the shelter.
- `UserID: INT [FK]` - The manager of the shelter.

#### **Relationships**
- **Shelter → Pet (1 → *)**: A shelter houses multiple pets.

---

### **3. Pet**
#### **Assumptions**
- The **Pet** entity represents animals available for adoption.
- Each pet belongs to **one Shelter**.

#### **Attributes**
- `PetID: INT [PK]` - Unique identifier for the pet.
- `ShelterID: INT [FK]` - Links to the shelter where the pet is housed.
- `Name: VARCHAR(50)` - Name of the pet.
- `Type: VARCHAR(20)` - Type of pet (e.g., Dog, Cat).
- `Breed: VARCHAR(50)` - Breed of the pet.
- `Age: INT` - Age of the pet.
- `Size: VARCHAR(20)` - Size classification (e.g., Small, Medium, Large).
- `Color: VARCHAR(50)` - Color of the pet.
- `Sex: VARCHAR(10)` - Gender of the pet.
- `DateOfIntake: DATE` - Date when the pet was brought to the shelter.

#### **Relationships**
- **Pet → Adoption Request (1 → *)**: A pet can receive multiple adoption requests.
- **Pet → Shelter (1 → 1)**: A pet belongs to exactly one shelter.
- **Pet → Medical_Record (0 → *)**: A pet may have multiple medical records.

---

### **4. Adoption Request**
#### **Assumptions**
- The **Adoption Request** entity tracks adoption applications submitted by **Users**.

#### **Attributes**
- `RequestID: INT [PK]` - Unique identifier for each adoption request.
- `UserID: INT [FK]` - The user making the request.
- `PetID: INT [FK]` - The pet being requested.
- `RequestDate: DATE` - Date the request was submitted.
- `Status: ENUM('Pending', 'Approved', 'Rejected')` - Tracks the request status.

#### **Relationships**
- **Adoption Request → User (1 → 1)**: An adoption request is submitted by one user.
- **Adoption Request → Pet (1 → 1)**: An adoption request refers to one pet.

---

### **5. Medical Record**
#### **Assumptions**
- Each medical record corresponds to a treatment or health-related event for a pet.

#### **Attributes**
- `RecordID: INT [PK]` – Unique identifier for the record.
- `PetID: INT [FK]` – References the pet.
- `Date: DATE` – The date of the record.
- `Description: TEXT` – Notes on the condition or treatment.
- `VetName: VARCHAR(50)` – Name of the vet.

#### **Relationships**
- **Medical_Record → Pet (1 → 1)**: Each record refers to one pet.

---

### **6. Past Adoption Record**
#### **Assumptions**
- Represents past adoption history. Not all users have a past record.
- A user can have multiple records.

#### **Attributes**
- `RecordID: INT [PK]` – Unique identifier for each past record.
- `UserID: INT [FK]` – References the adopter.
- `DateOfAdoption: DATE` – Date of adoption.
- `PetType: VARCHAR(20)` – Type of pet previously adopted.

#### **Relationships**
- **Past_Adoption_Record → User (1 → 1)**: A record belongs to one user.

---

## **Database Normalization (BCNF / 3NF)**
The database schema adheres to **BCNF** and **3NF**:

### **BCNF Compliance**
1. Every table has a primary key.
2. No partial dependencies.
3. No transitive dependencies.

### **Normalization Benefits**
- Eliminates redundancy
- Preserves functional dependencies
- Improves data integrity
- Allows flexible querying and indexing

---

## **Relational Schema (Logical Design)**
```
User(
  UserID: INT [PK],
  Name: VARCHAR(50),
  Email: VARCHAR(50) UNIQUE,
  Password: VARCHAR(100),
  PhoneNumber: VARCHAR(20)
)

Shelter(
  ShelterID: INT [PK],
  Name: VARCHAR(50),
  Location: VARCHAR(100),
  Email: VARCHAR(50) UNIQUE,
  PhoneNumber: VARCHAR(20),
  UserID: INT [FK to User.UserID]
)

Pet(
  PetID: INT [PK],
  ShelterID: INT [FK to Shelter.ShelterID],
  Name: VARCHAR(50),
  Type: VARCHAR(20),
  Breed: VARCHAR(50),
  Age: INT,
  Size: VARCHAR(20),
  Color: VARCHAR(50),
  Sex: VARCHAR(10),
  DateOfIntake: DATE
)

AdoptionRequest(
  RequestID: INT [PK],
  UserID: INT [FK to User.UserID],
  PetID: INT [FK to Pet.PetID],
  RequestDate: DATE,
  Status: ENUM('Pending', 'Approved', 'Rejected')
)

Medical_Record(
  RecordID: INT [PK],
  PetID: INT [FK to Pet.PetID],
  Date: DATE,
  Description: TEXT,
  VetName: VARCHAR(50)
)

Past_Adoption_Record(
  RecordID: INT [PK],
  UserID: INT [FK to User.UserID],
  DateOfAdoption: DATE,
  PetType: VARCHAR(20)
)
```


