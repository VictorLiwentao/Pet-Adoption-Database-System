## **UML Image**
![Pet Adoption (4)](https://github.com/user-attachments/assets/dbaa610d-6e11-4e71-82ed-6a57d75b99b2)



## **Entities and Assumptions**

### **1. User (Super Entity)**
#### **Assumptions**
- The **User** entity serves as a parent class for both **Adopter** and **Shelter Owner**.
- The **UserID** is the primary key, ensuring unique identification for all users.
- **PhoneNumber** is included for communication purposes.

#### **Attributes**
- `UserID: INT [PK]` - Unique identifier for each user.
- `Name: VARCHAR(50)` - Full name of the user.
- `Email: VARCHAR(50) UNIQUE` - Ensures each user has a distinct email for authentication.
- `Password: VARCHAR(100)` - Hashed password for security.
- `PhoneNumber: VARCHAR(20)` - Contact number of the user.
#### **Relationships**
- **User → Adoption_Request (0 → *)**: A user may has 0 to many adoption request.
- **User → Shelter Owner (0 → *)**: A user may has 0 to many shelter.

  
---

### **2. Shelter**
#### **Assumptions**
- A **Shelter** represents a pet adoption center that houses multiple pets.
- Each **Shelter** is managed by exactly **one Shelter Owner**.
- Each **Shelter** can have multiple **Pets**.

#### **Attributes**
- `ShelterID: INT [PK]` - Unique identifier for the shelter.
- `Name: VARCHAR(50)` - Shelter’s name.
- `Location: VARCHAR(100)` - Address of the shelter.
- `Email: VARCHAR(50) UNIQUE` - Contact email of the shelter.
- `PhoneNumber: VARCHAR(20)` - Contact number of the shelter.

#### **Relationships**
- **Shelter → Pet (1 → *)**: A shelter houses multiple pets.
- **Shelter → User (1 → 1)**: A shelter can managed by one Shelter Owner.

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
- `ImageURL: VARCHAR(200)` - URL for the pet's image.
- `DateOfIntake: DATE` - Date when the pet was brought to the shelter.

#### **Relationships**
- **Pet → Adoption Request (1 → *)**: A pet can receive multiple adoption requests.
- **Pet → Shelter (1 → 1)**: A pet can only in one shelter.

---

### **4. Adoption Request**
#### **Assumptions**
- The **Adoption Request** entity tracks adoption applications submitted by **Adopters**.

#### **Attributes**
- `RequestID: INT [PK]` - Unique identifier for each adoption request.
- `UserID: INT [FK to Adopter]` - The adopter making the request.
- `PetID: INT [FK]` - The pet being requested.
- `RequestDate: DATE` - Date the request was submitted.
- `Status: ENUM('Pending', 'Approved', 'Rejected')` - Tracks the request status.

#### **Relationships**
- **Adoption Request → User (1 → 1)**: An adoption request can only be submitted by one adopter
- **Adoption Request → Pet (1 → 1)**: An adoption request can only be received by one pet
- **Adoption Request → Status (1 → 1)**: An adoption request has only one status at a time.
---

### **5. Status**
#### Assumptions
- The **Status** entity standardizes the possible outcomes of an **Adoption Request**.

- It allows consistent handling and easy updates of request states across the system.

#### Attributes
- `StatusID: INT [PK]` – Unique identifier for each status.

- `Label: VARCHAR` – Human-readable name for the status (e.g., "Pending", "Approved", "Rejected").

- `Description: TEXT` – Optional detailed explanation of what the status means.

#### Relationships
- **Status → Adoption Request (1 -> *)**: A single status can be assigned to many adoption requests.

---

##  Database Normalization (BCNF / 3NF)
The database schema follows **Boyce-Codd Normal Form (BCNF)** and **Third Normal Form (3NF)** to ensure minimal redundancy and maximum data integrity.

### **BCNF Compliance**
1. **Every table has a primary key** ensuring entity uniqueness.
2. **No partial dependencies**: Each non-key attribute is fully dependent on the entire primary key.
3. **No transitive dependencies**: Every non-key attribute depends only on the primary key.

### **Normalization Explanation**
- **User** is a parent entity, ensuring that common attributes (e.g., `Name`, `Email`) are **not repeated** in `Adopter` or `ShelterOwner`.
- **Adopter** and **ShelterOwner** have `UserID` as a **foreign key**, ensuring **role separation** without data duplication.
- **Pet** is stored separately and **references Shelter** via `ShelterID`, enforcing **referential integrity**.
- **Adoption Requests** are stored separately to **avoid duplication** of pet and adopter details.

This ensures:

**Elimination of redundant data**  
**Preservation of functional dependencies**  
**Efficient querying and indexing**  

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
  ImageURL: VARCHAR(200),
  DateOfIntake: DATE
)

Status(
  StatusID: INT [PK],
  Label: VARCHAR(20),
  Description: TEXT
)

AdoptionRequest(
  RequestID: INT [PK],
  UserID: INT [FK to User.UserID],
  PetID: INT [FK to Pet.PetID],
  RequestDate: DATE,
  StatusID: INT [FK to Status.StatusID]
)

```
