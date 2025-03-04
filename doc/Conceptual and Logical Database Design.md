## **UML Image**
![Pet Adoption drawio](https://github.com/user-attachments/assets/21009b7d-ea29-461b-82ec-0b880ad21bcf)


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
- **User → Adopter (0 → 1)**: A user may be an adopter or a shelter owner.
- **User → Shelter Owner (0 → 1)**: A user may be an adopter or a shelter owner.

---

### **2. Adopter (Subclass of User)**
#### **Assumptions**
- The **Adopter** entity represents users who are interested in adopting pets.
- It inherits **UserID** from the **User** entity.
- Each adopter can submit multiple **Adoption Requests**.

#### **Attributes**
- `AdopterID: INT [FK]` - Unique identifier for the adopter.
- `UserID: INT [FK]` - Inherited from **User**.
- `Address: TEXT` - Physical address of the adopter.

#### **Relationships**
- **Adopter → Adoption Request (1 → *)**: An adopter can submit multiple adoption requests.
- **Adopter → User (1 → 1)**: A adopter must be an user.
---

### **3. Shelter Owner (Subclass of User)**
#### **Assumptions**
- The **Shelter Owner** manages one or more shelters.
- It inherits **UserID** from **User**.
- Each shelter owner is responsible for at least **one shelter**.

#### **Attributes**
- `OwnerID: INT [FK]` - Unique identifier for the shelter owner.
- `UserID: INT [FK]` - Inherited from **User**.
- `ShelterID: INT [FK]` - Links to the shelter(s) the owner manages.

#### **Relationships**
- **Shelter Owner → Shelter (1 → *)**: A shelter owner can manage multiple shelters.
- **Shelter Owner → User (1 → 1)**: A shelter owner must be an user.
  
---

### **4. Shelter**
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
- **Shelter → Shelter Owner (1 → 1)**: A shelter can managed by one Shelter Owner.

---

### **5. Pet**
#### **Assumptions**
- The **Pet** entity represents animals available for adoption.
- Each pet belongs to **one Shelter**.
- Each pet is classified under **one Pet Category**.

#### **Attributes**
- `PetID: INT [PK]` - Unique identifier for the pet.
- `ShelterID: INT [FK]` - Links to the shelter where the pet is housed.
- `CategoryID: INT [FK]` - Links to the category the pet belongs to.
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
- **Pet → Pet Category ('*' → 1)**: Each pet belongs to one category.
- **Pet → Shelter (1 → *)**: A pet can only in one shelter.

---

### **6. Adoption Request**
#### **Assumptions**
- The **Adoption Request** entity tracks adoption applications submitted by **Adopters**.
- Each request links to **one Adopter** and **one Pet**.
- The **Status** field tracks the approval process.

#### **Attributes**
- `RequestID: INT [PK]` - Unique identifier for each adoption request.
- `UserID: INT [FK to Adopter]` - The adopter making the request.
- `PetID: INT [FK]` - The pet being requested.
- `RequestDate: DATE` - Date the request was submitted.
- `Status: ENUM('Pending', 'Approved', 'Rejected')` - Tracks the request status.

#### **Relationships**
- **Adoption Request → Adopter (1 → 1)**: An adoption request can only be submitted by one adopter
- **Adoption Request → Pet (1 → 1)**: An adoption request can only be received by one pet
---

### **7. Pet Category**
#### **Assumptions**
- The **Pet Category** classifies pets based on type, breed, and size.
- A **Category** can contain multiple pets.

#### **Attributes**
- `CategoryID: INT [PK]` - Unique identifier for the category.
- `Type: VARCHAR(50)` - Type of pet (e.g., Dog, Cat, Bird).
- `Breed: VARCHAR(50)` - Specific breed classification.
- `Size: VARCHAR(20)` - Size category (e.g., Small, Medium, Large).

#### **Relationships**
- **Pet Category → Pet (1 → *)**: A category can contain multiple pets.

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
User(UserID: INT [PK], Name: VARCHAR(50), Email: VARCHAR(50), Password: VARCHAR(100), PhoneNumber: VARCHAR(20))
Adopter(AdopterID: INT [PK], UserID: INT [FK to User.UserID], Address: TEXT)
ShelterOwner(OwnerID: INT [PK], UserID: INT [FK to User.UserID], ShelterID: INT [FK to Shelter.ShelterID])
Shelter(ShelterID: INT [PK], Name: VARCHAR(50), Location: VARCHAR(100), Email: VARCHAR(50), PhoneNumber: VARCHAR(20))
Pet(PetID: INT [PK], ShelterID: INT [FK to Shelter.ShelterID], CategoryID: INT [FK to PetCategory.CategoryID], Name: VARCHAR(50), Type: VARCHAR(20), Breed: VARCHAR(50), Age: INT, Size: VARCHAR(20), Color: VARCHAR(50), Sex: VARCHAR(10), ImageURL: VARCHAR(200), DateOfIntake: DATE)
AdoptionRequest(RequestID: INT [PK], AdopterID: INT [FK to Adopter.AdopterID], PetID: INT [FK to Pet.PetID], RequestDate: DATE, Status: ENUM('Pending', 'Approved', 'Rejected'))
PetCategory(CategoryID: INT [PK], Type: VARCHAR(50), Breed: VARCHAR(50), Size: VARCHAR(20))
```
