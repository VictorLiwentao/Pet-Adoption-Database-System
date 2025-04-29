# Pet Adoption Application

## Q1:Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).
### A:
   
Our final pet adoption platform ended up evolving quite a bit from what we originally proposed, although the core mission, connecting adopters with shelter animals — stayed the same. In the beginning, our plan was to build a basic application focused on simple pet browsing and favorites functionality. However, as we got deeper into development, we realized there were more meaningful features we could add to make the platform genuinely useful for both adopters and shelters.

One major shift was the addition of a personalized pet recommendation system. This wasn’t part of our original idea, but after working with the data, it became clear that matching users to pets based on compatibility would make the adoption process more efficient and rewarding. We also introduced a senior pets report feature to highlight older animals who often have a harder time finding homes, and an adoption statistics dashboard to provide shelters and users with real insights into adoption trends.

On the technical side, the project became more complex than we first expected. We moved beyond simple features like a favorites list and a basic image carousel, adding real-time integration with multiple shelters, advanced filtering and search options, user account management with adoption request tracking, and analytics tools for shelters. This also led us to redesign the database, expanding it to include interconnected tables for users, pets, shelters, medical records, and adoption requests to better support the new features.

Overall, while our original proposal focused mainly on browsing and basic queries, the final product turned into a adoption management platform. We try to model real challenges faced by adopters and shelters, and the improvements we made along the way helped create a much more impactful application than we initially envisioned.

   
## Q2: Discuss what you think your application achieved or failed to achieve regarding its usefulness.
###   A: 

   Our project aimed to build a pet adoption website that connects potential adopters with pets in shelters. First, the application allows users to easily browse pets available for adoption, submit adoption requests, and view their adoption history. Shelters can also view aggregated statistics about adoption activities, such as the number of requests they have received and the types of pets that are most popular. These features closely match the real-world needs of a pet adoption system: simplifying the adoption process for users while helping shelters manage their animals more effectively.
   
  Moreover, through the development of multiple advanced queries, our system provides shelters with valuable insights — such as identifying senior pets that need extra promotion, recognizing active adopters, and spotting users who may need additional guidance based on their adoption request history. These analytics make the application not just functional, but also strategic for improving adoption outcomes and shelter operations.
  
  However, there are areas where the application could improve in usefulness. One limitation is that the current system assumes users and shelters interact independently without real-time notifications (e.g., notifying users when their adoption request status changes). Adding features like live updates or communication channels would make the system even more practical and engaging.
  
  Overall, our application achieved its core mission of streamlining the adoption process and providing actionable insights for shelters, but future enhancements could focus on improving user interaction and personalization.
  
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

   
Relationship Implementation

Original design: Showed theoretical relationships (1→*, 0→*, etc.)
Final implementation: Actually implemented these relationships through foreign keys and proper MySQL constraints
The implementation includes CASCADE operations for deletions to maintain referential integrity


Additional Tracking Mechanisms

The final implementation added query functionality for reporting on senior pets and adoption statistics that weren't explicitly mentioned in the original ER diagram
These features required additional query logic beyond the basic table structure


User Management

Original design: Basic user attributes
Final implementation: Added authentication and session management through the web interface
This necessitated additional application logic to handle user state


Shelter Management

Original design: Simple shelter-to-pet relationship
Final implementation: Added filtering, reporting, and analytics for shelters
The final database supports more complex queries about shelter performance



Why These Changes Were Made

Practical Implementation Needs

The theoretical ER diagram needed to be adapted to work with real-world web application requirements
The server.js implementation shows how these relationships needed to function in practice


Feature Enhancement

As you developed the unique features like recommendation systems and senior pet reporting, the database design needed to accommodate these specialized queries
The implementation demonstrates how the base schema supported these advanced features


User Experience Considerations

The final implementation had to support a more robust user journey as shown in the HTML files
This required adding functionality beyond what was initially modeled in the ER diagram



More Suitable Design Assessment
The final implementation appears more suitable for several reasons:

Flexibility

Using VARCHAR instead of ENUMs for status fields provides more adaptability as requirements change
The implementation includes more comprehensive queries that can extract deeper insights


Full Feature Support

The final design supports all the specialized features (recommendations, senior pet reporting, statistics) that make your application unique
These features required more sophisticated data relationships than initially modeled


Real-world Usability

The implementation includes practical considerations like error handling, transaction management, and proper indexing that theoretical ER diagrams often overlook
The server-side implementation shows how these tables actually need to interact in a live environment


Scalability

The final design uses connection pooling and proper query optimization
This makes it more suitable for handling real-world load compared to the theoretical design



The most significant improvement in the final design is how it enables the specialized features (recommendations, senior pet visibility, statistics) that differentiate your platform from similar solutions. These required a more thoughtful implementation than what was initially modeled in the ER diagram, demonstrating how database design evolves alongside feature development.
## Q5: Discuss what functionalities you added or removed. Why?
###   A: 

Functionalities Added

Personalized Pet Recommendation System

This sophisticated matching algorithm connects users with compatible pets based on their profile data
Why added: To solve the "adoption paradox" where too many choices overwhelm potential adopters, leading to decision paralysis
This enhances the user experience by presenting tailored options instead of forcing users to sift through hundreds of listings


Senior Pets Report Feature

Specialized visibility for older animals that typically wait 3-4 times longer for adoption
Why added: To address a significant gap in the adoption ecosystem by highlighting a vulnerable population
This creates opportunities for these often-overlooked animals and connects them with adopters who might specifically prefer mature pets


Adoption Statistics Dashboard

Provides transparency into adoption rates, processing times, and shelter performance
Why added: To bring data-driven insights to the adoption process, benefiting shelters with operational metrics and giving adopters confidence through transparency
This creates accountability in the system and helps shelters identify improvement opportunities


Complete Application Status Tracking

Allows users to monitor their adoption requests from submission to approval/rejection
Why added: To eliminate uncertainty in the adoption process and keep users engaged
This reduces applicant frustration and abandonment by providing visibility into request status


Shelter Search and Filtering

Enhanced functionality to find shelters by ID and filter pets by shelter
Why added: To enable more targeted searching based on location preferences
This helps users who might prefer to adopt from specific organizations or locations



Functionalities Removed:

Simple Email Contact Form

The original proposal mentioned a basic email contact form, but this was replaced with the more structured adoption request system
Why removed: The direct adoption request system provides better tracking and standardization than free-form email inquiries
This structured approach creates clearer expectations and more consistent communication

Rationale for These Changes
The functionality changes reflect a shift from a simple pet browsing platform to a comprehensive adoption ecosystem that addresses the needs of all stakeholders:

User-Centered Design: The added recommendation system and status tracking create a more personalized, engaging experience that guides users through the adoption journey.
Social Impact: Features like the Senior Pets Report demonstrate a commitment to animal welfare beyond just facilitating adoptions.
Data-Driven Approach: The statistics dashboard and enhanced filtering represent a more sophisticated understanding of how data can improve the adoption ecosystem.
Complete Adoption Lifecycle: Rather than just connecting adopters with pets, the final implementation supports the entire process from discovery to completed adoption.

These changes significantly expanded the platform's scope from the original proposal, creating a more robust solution that addresses deeper challenges in pet adoption than just pet discovery.
      
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
