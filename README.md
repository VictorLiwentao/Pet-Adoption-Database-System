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


⸻

🚀 Getting Started
	1.	Clone & Install

git clone https://github.com/your-username/pet-adoption-system.git
cd pet-adoption-system/server
npm install


	2.	Database Setup
	•	Create a MySQL database (e.g. pet_adoption).
	•	Import CSV files into corresponding tables.
	•	Run SQL scripts in /server:

SOURCE AdoptionTrigger.sql;
SOURCE FindSeniorPets.sql;
SOURCE FindSuitablePets.sql;
SOURCE ProcessAdoption.sql;


	3.	Run the Server

node server.js

Open /public/searchPage.html in your browser to begin.

⸻

⚙️ Usage
	•	Browse Pets: /public/searchPage.html
	•	View Profile & Favorite: /public/petPage.html
	•	Sign Up / Track Requests: /public/userPage.html

⸻

📄 License

Released under the MIT License.
