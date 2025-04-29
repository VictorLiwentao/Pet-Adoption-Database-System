# Pet Adoption Application

## Q1:Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).
### A:
   
Our final pet adoption platform ended up evolving quite a bit from what we originally proposed, although the core mission, connecting adopters with shelter animals — stayed the same. In the beginning, our plan was to build a basic application focused on simple pet browsing and favorites functionality. However, as we got deeper into development, we realized there were more meaningful features we could add to make the platform genuinely useful for both adopters and shelters.

One major shift was the addition of a personalized pet recommendation system. This wasn’t part of our original idea, but after working with the data, it became clear that matching users to pets based on compatibility would make the adoption process more efficient and rewarding. We also introduced a senior pets report feature to highlight older animals who often have a harder time finding homes, and an adoption statistics dashboard to provide shelters and users with real insights into adoption trends.

On the technical side, the project became more complex than we first expected. We moved beyond simple features like a favorites list and a basic image carousel, adding real-time integration with multiple shelters, advanced filtering and search options, user account management with adoption request tracking, and analytics tools for shelters. This also led us to redesign the database, expanding it to include interconnected tables for users, pets, shelters, medical records, and adoption requests to better support the new features.

Overall, while our original proposal focused mainly on browsing and basic queries, the final product turned into a adoption management platform. We try to model real challenges faced by adopters and shelters, and the improvements we made along the way helped create a much more impactful application than we initially envisioned.

   
## Q2: Discuss what you think your application achieved or failed to achieve regarding its usefulness.
###   A: 

Our project was about building a pet adoption website to help connect people looking to adopt with animals in shelters. We made it simple for users to browse available pets, submit adoption requests, and keep track of their past adoptions. Shelters can also benefit by viewing important statistics about their adoption activity, like which pets are most popular and how many adoption requests they’re receiving. We designed these features with real-world needs in mind, aiming to make adoption easier for adopters and help shelters manage their animals better.

We also developed some useful analytics features, such as highlighting older pets who often struggle to get adopted, recognizing the most active adopters, and identifying users who might need extra assistance during the adoption process. These analytical tools go beyond just basic functionality as they help shelters strategically improve adoption outcomes and manage operations more effectively.

Still, there’s room for improvement. Right now, the application doesn’t have real-time notifications, meaning users aren’t immediately informed when something changes with their adoption requests. Adding live updates or direct communication features could make the app more engaging and practical.

Overall, we succeeded in creating an application that streamlined the adoption process and offered valuable insights for shelters. In the future, we could improve it even further by enhancing user interactions and providing more personalized experiences.
  
## Q3: Discuss if you changed the schema or source of the data for your application
###   A: 

Changes to Data Schema and Data Sources
Original Schema (from Proposal)
Your original proposal mentioned a simple dataset structure that would include:

Basic pet attributes (Animal ID, Name, Type, Breed, Age, Size, Color, Sex)
Intake information (Date of Intake)
Shelter details
Image URL

The proposal suggested using a CSV file with structured attributes and potentially integrating "live pet adoption APIs from shelters" as an additional data source.
Final Schema Implementation
The final implementation significantly expanded the database schema into a more comprehensive relational database with multiple interconnected tables:

User Table: Added to store user profiles with fields for UserID, Name, Email, Password, and PhoneNumber
Shelter Table: Expanded to include ShelterID, Name, Location, Email, PhoneNumber, and a relationship to User
Pet Table: Enhanced with additional relationships and fields including ShelterID foreign key, more detailed pet attributes, and DateOfIntake
AdoptionRequest Table: New table tracking the entire adoption process with RequestID, UserID, PetID, RequestDate, and Status
MedicalRecord Table: New table to store pet medical history with RecordID, PetID, Date, Description, and VetName
PastAdoptionRecord Table: New table for historical adoption data with RecordID, UserID, DateOfAdoption, and PetType

Data Source Changes
The original proposal mentioned using:

A static CSV file as the primary data source
Potential integration with shelter APIs

The final implementation appears to have shifted to:

A dynamic MySQL database with real-time data management
Custom data entry through the application itself rather than external APIs
Server-side processing for advanced features like recommendations and statistics

The implementation uses a connection pool architecture for database access, suggesting a more scalable approach than the originally proposed flat file structure.
Significance of These Changes
These schema and data source changes enabled the advanced features in your final implementation:

The sophisticated recommendation system requires user profiles and detailed pet characteristics
The senior pets report necessitates accurate age tracking and adoption status
The adoption statistics dashboard relies on historical data across multiple dimensions
Real-time tracking of adoption requests requires relationship mapping between users and pets

By developing a more robust data model than initially proposed, the application gained the ability to deliver the innovative features that differentiate it from existing solutions.
   
## Q4: Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 
###   A:

   
In transitioning from our original ER diagram to the final implementation, we made several notable changes. Initially, the ER diagram included theoretical relationships, such as one-to-many and optional-to-many, but in practice, we had to explicitly implement these relationships using foreign keys and proper MySQL constraints, including CASCADE operations to ensure referential integrity during deletions.

We also added several features that weren’t anticipated in the original design. For instance, functionalities like senior pet reporting and detailed adoption statistics required additional tables and more complex queries. These enhancements went beyond basic table structures, necessitating modifications to better capture relevant data for these reports.

Another significant update involved user management. The original design only accounted for basic user attributes, but in our final implementation, we included authentication and session handling. This meant integrating extra fields and logic into our database and application code to manage user state effectively.

Similarly, our approach to shelter management became more advanced. Initially, the database structure simply linked pets to shelters, but in the final version, we expanded this to support detailed filtering, reporting, and analytics. This allowed shelters to gain deeper insights into their operations and adoption trends.

These adjustments were primarily driven by practical considerations. The original ER diagram, while useful conceptually, wasn’t sufficient to support all the advanced functionalities we wanted to include. As we developed features like the recommendation system and senior pet visibility, the database schema naturally evolved to support these specialized queries.

The most significant improvement in the final design is how it enables the specialized features (recommendations, senior pet visibility, statistics) that differentiate your platform from similar solutions. These required a more thoughtful implementation than what was initially modeled in the ER diagram, demonstrating how database design evolves alongside feature development.

Overall, the final design proved to be much more suitable for several reasons. It provided greater flexibility—such as using VARCHAR rather than ENUMs for status fields—which allows easier adaptation as requirements change. Additionally, the final implementation supported specialized features that distinguish our application from others. We also prioritized real-world usability by incorporating proper indexing, error handling, and transaction management, which theoretical diagrams often overlook. Lastly, the final structure was designed for scalability, using strategies like connection pooling and optimized queries, better preparing the system for real-world workloads. 




## Q5: Discuss what functionalities you added or removed. Why?
###   A: 

Functionalities Added:
1.	Personalized Pet Recommendation System
   
What it does: Matches users with compatible pets based on their profile data.
Why we added it: To combat choice overload and guide adopters toward pets they’re more likely to connect with, reducing decision paralysis and improving user satisfaction.

2.	Senior Pets Report Feature

What it does: Highlights older animals that typically wait several times longer for adoption.
Why we added it: To give extra visibility to a vulnerable population and help these pets find homes more quickly.

3.	Adoption Statistics Dashboard

What it does: Presents shelters with metrics on adoption rates, processing times, and pet popularity.
Why we added it: To enable data-driven decision-making, boost transparency, and allow shelters to identify areas for improvement.

5.	Complete Application Status Tracking
   
What it does: Lets users follow their adoption requests from submission through approval or rejection.
Why we added it: To remove uncertainty, keep adopters informed, and reduce frustration or abandonment of requests.

7.	Shelter Search and Filtering
   
What it does: Enables users to find shelters by ID and filter available pets by shelter.
Why we added it: To support location-based preferences and allow adopters to target specific shelters.

Functionalities Removed:

1.	Simple Email Contact Form
   
What it was: A free-form form for general inquiries.
Why we removed it: We replaced it with a structured adoption-request system to standardize communication, improve tracking, and set clear expectations for both adopters and shelters.

Rationale:
These changes reflect our move from a basic browsing app to a full adoption ecosystem. By adding personalization (recommendations, senior reports), transparency (dashboards, status tracking), and targeted search, we addressed real challenges faced by adopters and shelters. Removing the email form in favor of a formal request workflow further enhanced consistency and accountability throughout the adoption process.

      
## Q6: Explain how you think your advanced database programs complement your application.
###   A: 

   Our advanced database programs — including transactions, stored procedures, triggers, and constraints — were designed to enhance the completeness and usability of our pet adoption application.
   Constraints (such as primary keys, foreign keys, and attribute-level checks) ensure that the database always maintains valid and consistent data. For example, by enforcing relationships between users, shelters, pets, and adoption requests, we prevent invalid or orphaned records that could confuse users.
    
   Transactions allow us to group multiple operations together safely, guaranteeing that key activities — such as submitting an adoption request and updating pet availability — are completed reliably. 
   
   Stored procedures improve the efficiency and reusability of complex operations, such as generating reports on shelter adoption rates or filtering senior pets needing promotion.
    
   Triggers automate important background tasks. For instance, when a new adoption request is inserted, a trigger can automatically update related status fields without requiring extra logic in the frontend application. This reduces manual work, ensures consistency, and helps maintain smooth real-time operations.
    
   Overall, these advanced database features complement our application by ensuring data quality, improving operational reliability, automating routine maintenance tasks, and providing faster, more scalable backend processing to support user interactions.
    
## Q7: Each team member should describe one technical challenge that the team encountered.  This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project. 
###   A: 

   Hanning: Query optimization. When we were doing Indexing, it not always comes with better performances. Understanding and interpreting the query execution plan (EXPLAIN) was challenging, and we had to choose which indexes to add very carefully.
   
   Tongrui: The server was not easy to set up, I spent a lot of time talking about the frontend and backend to establish the connection and make matches after each change. It was always not working the way I actually wanted it to, so it went through multiple changes. Debugging is a very time-consuming and not always productive endeavor. So my advice is to always plan for expectations and have your own visualization of what will be on display.
      
   Xin: One challenge I faced was in designing the animal shelter webpage was organizing a lot of information clearly. At first, the page looked messy. I solved it by using HTML sections like header, section, and footer. This made the website easier to read and helped users find information faster.
      
  Victor: One challenge our team encountered was during indexing for query optimization. We were not familiar with working on SQL databases outside of the PrairieLearn environment. When we added indexes and other constraints, we discovered that removing or altering them during EXPLAIN ANALYZE testing was difficult, especially because certain indexes or foreign keys could not be dropped easily or caused dependency errors. Additionally, without careful reset control, old constraints could lead to misleading query plans or prevent the creation of new schema designs. Our solution was to create a reset script that would drop and recreate the database, then reload the schema and data. This allowed us to consistently restart from a clean state for each round of indexing and performance testing.
      
## Q8: Are there other things that changed comparing the final application with the original proposal?
###   A:

Interactive Dashboard - The implementation includes more dynamic elements like dropdowns and modals that weren't specified in the original low-fidelity mockup

Mobile Responsiveness - The final implementation includes responsive design elements using Tailwind CSS that weren't explicitly mentioned in the proposal

Shelter-Centric Features - The final implementation places greater emphasis on shelter operations and management than the original adopter-focused proposal
Animal Categorization - The implementation includes more specific animal categorization (Dogs, Cats, Rabbits, Birds, Hamsters) than the general "species" mentioned in the proposal
   
## Q9: Describe future work that you think, other than the interface, that the application can improve on.
###   A: 

Technical Enhancements

Implement real-time notification system for adoption status updates
Develop an API for shelters to bulk upload/update pet data
Add machine learning-based image recognition to identify pet features from photos

Functional Improvements

Create a pet behavior assessment system to improve matching accuracy
Implement a follow-up system to track post-adoption pet welfare
Add a foster program management module alongside adoption

Data Analytics

Develop predictive models for adoption likelihood based on pet attributes
Create geographic heat maps showing adoption rates by location
Implement seasonal trend analysis to optimize marketing efforts

Integration Opportunities

Connect with veterinary service providers for seamless medical record transfer
Integrate with pet supply retailers for new adopter discount programs
Add calendar synchronization for shelter visits and adoption events
      
## Q10: Describe the final division of labor and how well you managed teamwork.
###  A: 

Tongrui: Completing the server, connecting the front and back ends, and completing the realization of various functions.

Xin: Front-end production and data screening

Hanning: Data collection and organization, summarizing content.

Victor: Propose achievable functions and optimize the query.

We had very good communication, and everyone responded positively whenever a meeting was proposed. We have almost no barriers to communication.

## Project Video
https://mediaspace.illinois.edu/media/t/1_amed6ijf
