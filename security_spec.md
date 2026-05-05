# Phase 0: Payload-First Security TDD

## Data Invariants
1. Products: Read-only for all users. Cannot be written by unauthenticated or unauthorized users.
2. Reviews: A review cannot be created by an unverified email. It cannot fake the `userId`. Must maintain exact schema and terminal state `status`.
3. Clicks: Should only be created. Read is forbidden.

## The "Dirty Dozen" Payloads

1. **Schema Break (Shadow Field)**: Create a Review with an extra property `isAdmin: true`.
2. **Missing Property**: Create a Review missing the `body`.
3. **Invalid ID Form**: Create a Review with ID containing path traversal `../`.
4. **Identity Spoofing**: Create a Review where `userId` does not match `request.auth.uid`.
5. **State Skipping**: Update a Review from `pending` directly to `approved` (if normal user).
6. **Denial of Wallet (Huge String)**: Create a Review with body of 2MB text.
7. **Type Poisoning**: Update rating in Review to a String instead of Number.
8. **Terminal State Violation**: Attempt to edit a Review's rating after it has been `rejected`.
9. **Unverified Email**: Attempt to create a Review using an email that is not verified.
10. **Query Theft**: List all reviews, expecting to bypass the `resource.data.status == 'approved'` filter (the client must query filtered).
11. **Relational Missing Parent (if applicable)**: Create review for non-existent `productId`.
12. **Blanket Read of Clicks**: Attempt to list all clicks in the DB.

## Test Runner (firestore.rules.test.ts)
(Provided below in another file)
