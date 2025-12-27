# Fault-Tolerant Data Processor

1. What assumptions did you make? 
- I assumed that if the entire JSON payload is identical, it is a duplicate event.
- I assumed "amount" should be a number and "timestamp" should be standardized to ISO format.

2. How does your system prevent double counting? 
- The system creates a unique "hash" (fingerprint) of the incoming data.
- If a new request has the same hash as one already processed, it is ignored.

3. What happens if the database fails mid-request?
- The system uses a "try-catch" block. The event is only marked as "processed" if the database write is successful.
- If it fails, no record is saved, allowing the client to retry safely.

4. What would break first at scale?
- Currently, the list of processed events is stored in the server's memory.
- If the server restarts or if there are millions of events, the memory will run out.A real system would use a database like Redis, etc.
