We deleted FK for the UML diagram

We removed the Adopter and ShelterOwner, as well as the PetCategory tables, to simplify the schema and avoid redundancy. All user roles are now handled through the core User table and relationships.

We redefined the role of Adoption_Request to be a relationship between User and Pet directly, rather than introducing a separate Adopter entity.

We added a new entity, Adoption_Record, to track confirmed past adoptions. This allows us to differentiate between requests and actual adoptions.

A new Medical_Record table related to pets was introduced to store veterinary records such as treatment descriptions and dates.

All relationships are now explicitly named and aligned with a normalized relational model.
