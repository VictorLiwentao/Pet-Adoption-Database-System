# Pet Adoption Application

## Q1:Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).
   A:
   
## Q2: Discuss what you think your application achieved or failed to achieve regarding its usefulness.
   A: 
   Our project aimed to build a pet adoption website that connects potential adopters with pets in shelters. First, the application allows users to easily browse pets available for adoption, submit adoption requests, and view their adoption history. Shelters can also view aggregated statistics about adoption activities, such as the number of requests they have received and the types of pets that are most popular. These features closely match the real-world needs of a pet adoption system: simplifying the adoption process for users while helping shelters manage their animals more effectively.
   
  Moreover, through the development of multiple advanced queries, our system provides shelters with valuable insights — such as identifying senior pets that need extra promotion, recognizing active adopters, and spotting users who may need additional guidance based on their adoption request history. These analytics make the application not just functional, but also strategic for improving adoption outcomes and shelter operations.
  
  However, there are areas where the application could improve in usefulness. One limitation is that the current system assumes users and shelters interact independently without real-time notifications (e.g., notifying users when their adoption request status changes). Adding features like live updates or communication channels would make the system even more practical and engaging.
  
  Overall, our application achieved its core mission of streamlining the adoption process and providing actionable insights for shelters, but future enhancements could focus on improving user interaction and personalization.
  
## Q3: Discuss if you changed the schema or source of the data for your application
   A: 
   
## Q4: Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 
   A:
   
## Q5: Discuss what functionalities you added or removed. Why?
   A: 
   Functionalities Added:
    Advanced Analytical Queries: As the project evolved, we added several advanced queries, such as identifying shelters specializing in certain pet types, spotting senior pets needing urgent adoption, and detecting users with problematic request patterns. These queries provides us more comprehensive insights of shelters and adoption requests. Detailed Pet Medical Record Tracking: We introduced a feature that shows how long each pet has been at the shelter and their latest medical visit details. This functionality helps prioritize animals needing urgent care or promotion.
    
   Functionalities Removed:
      
## Q6: Explain how you think your advanced database programs complement your application.
   A: 
   Our advanced database programs — including transactions, stored procedures, triggers, and constraints — were designed to enhance the completeness and usability of our pet adoption application.
   Constraints (such as primary keys, foreign keys, and attribute-level checks) ensure that the database always maintains valid and consistent data. For example, by enforcing relationships between users, shelters, pets, and adoption requests, we prevent invalid or orphaned records that could confuse users.
    
   Transactions allow us to group multiple operations together safely, guaranteeing that key activities — such as submitting an adoption request and updating pet availability — are completed reliably. 
   
   Stored procedures improve the efficiency and reusability of complex operations, such as generating reports on shelter adoption rates or filtering senior pets needing promotion.
    
   Triggers automate important background tasks. For instance, when a new adoption request is inserted, a trigger can automatically update related status fields without requiring extra logic in the frontend application. This reduces manual work, ensures consistency, and helps maintain smooth real-time operations.
    
   Overall, these advanced database features complement our application by ensuring data quality, improving operational reliability, automating routine maintenance tasks, and providing faster, more scalable backend processing to support user interactions.
    
## Q7: Each team member should describe one technical challenge that the team encountered.  This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project. 
   A: 
   Hanning: Query optimization. When we were doing Indexing, it not always comes with better performances. Understanding and interpreting the query execution plan (EXPLAIN) was challenging, and we had to choose which indexes to add very carefully.
   
   Tongrui:
      
   Xin:
      
   Wentao:
      
## Q8: Are there other things that changed comparing the final application with the original proposal?
   A:
   
## Q9: Describe future work that you think, other than the interface, that the application can improve on.
   A: 
   Adding personalized recommendations based on a user’s past adoption history or search behavior could greatly enhance user engagement. For example, if a user has previously adopted senior cats, the system could highlight available senior cats for them in the future.
   
   Another future improvement would be real-time status notifications. Currently, adoption request status changes are not actively pushed to users. Implementing notification systems (such as emails or in-app alerts) would make the platform feel more interactive and responsive.
      
## Q10: Describe the final division of labor and how well you managed teamwork.
       A: 

