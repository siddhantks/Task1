# Fault-Tolerant Data Processor

### [cite_start]1. What assumptions did you make? 
- [cite_start]I assumed that if the entire JSON payload is identical, it is a duplicate event. [cite: 57, 63]
- [cite_start]I assumed "amount" should be a number and "timestamp" should be standardized to ISO format. [cite: 38, 44, 45]

### [cite_start]2. How does your system prevent double counting? [cite: 99]
- [cite_start]The system creates a unique "hash" (fingerprint) of the incoming data. [cite: 19, 61]
- If a new request has the same hash as one already processed, it is ignored.

### [cite_start]3. What happens if the database fails mid-request? [cite: 99]
- The system uses a "try-catch" block. [cite_start]The event is only marked as "processed" if the database write is successful. [cite: 20, 68]
- [cite_start]If it fails, no record is saved, allowing the client to retry safely. [cite: 69, 71]

### [cite_start]4. What would break first at scale? [cite: 99]
- [cite_start]Currently, the list of processed events is stored in the server's memory. [cite: 93]
- If the server restarts or if there are millions of events, the memory will run out. [cite_start]A real system would use a database like Redis or PostgreSQL. [cite: 95]