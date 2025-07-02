Pet Adoption System

A full-stack web application that connects adopters with shelter pets, streamlining search, favorites, adoption requests, and data-driven insights.

⸻

## 🔍 Features

- **Advanced Search & Filter**  
  Search by species, breed, age, size, color, medical status, shelter location, and more.

- **Favorites & Recommendations**  
  Save favorite pets and receive personalized suggestions based on user profiles.

- **Adoption Workflow**  
  Submit, track, and manage adoption requests with clear status updates.

- **Senior Pets Spotlight**  
  Automatically highlight older animals in need of extra visibility.

- **Analytics Dashboard**  
  Real-time metrics: request volume, popular breeds, time-to-adopt, and shelter performance.

- **Automated Data Integrity**  
  ACID transactions, triggers, and stored procedures ensure consistency and up-to-the-second statistics.
  
---

## 🛠 Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Backend API   | Node.js · Express.js              |
| Database      | MySQL (InnoDB)                    |
| Frontend      | HTML · Tailwind CSS · Vanilla JS  |
| DB Automation | Stored Procedures · Triggers      |
| Data Import   | CSV seed scripts → MySQL          |

---

📁 Repository Structure

/data
  ├─ pet_data.csv            ← seed data for pets  
  ├─ shelter_data.csv        ← seed data for shelters  
  └─ user_data.csv           ← seed data for adopters  

/public
  ├─ images/                 ← pet photos (Dog.jpg, Cat.jpg, etc.)  
  ├─ searchPage.html         ← browse & filter UI  
  ├─ petPage.html            ← detailed pet profile & “favorite” button  
  └─ userPage.html           ← sign-up, login & request tracker  

/server
  ├─ server.js               ← Express routes & middleware  
  ├─ AdoptionTrigger.sql     ← trigger to sync pet availability  
  ├─ FindSeniorPets.sql      ← procedure for senior-pet reports  
  ├─ FindSuitablePets.sql    ← procedure for advanced search logic  
  └─ ProcessAdoption.sql     ← transaction procedure for adoption requests  

/doc
  ├─ Database Design.md      ← ER diagram & schema notes  
  ├─ Project Proposal.md     ← initial scope & feature list  
  └─ Project Report.md       ← final outcomes & reflections  

README.md                    ← this file


---

📄 License

Released under the MIT License.
