# TBK Services DB Design
* This document provides a comprehensive overview of the database schema for the TBK Services.
* The schema is designed to manage villas, user roles, bookings, expenses, and amenities.

---

## 1️⃣ User Table

**Table Name:** `User`  
**Purpose:** Stores all system users (admin, staff, etc.)

| Column       | Type      | Description |
|-------------|-----------|-------------|
| id          | Int       | Primary key, auto-incremented |
| firstName   | String    | User’s first name |
| lastName    | String    | User’s last name |
| email       | String    | Unique email of the user |
| password    | String    | Hashed password |
| roleId      | Int?      | Foreign key to `Role` table (nullable) |
| createdAt   | DateTime  | Timestamp of creation |
| updatedAt   | DateTime  | Timestamp of last update |

**Relationships:**

- `User → Role` : Many-to-One (Many users can have the same role)  
- `User → UserPermission` : One-to-Many (User can have multiple explicit permissions)

---

## 2️⃣ Role Table

**Table Name:** `Role`  
**Purpose:** Defines roles in the system (Admin, Staff, etc.)

| Column       | Type      | Description |
|-------------|-----------|-------------|
| id           | Int      | Primary key, auto-incremented |
| name         | String   | Unique role name |
| createdAt    | DateTime | Timestamp of creation |
| updatedAt    | DateTime | Timestamp of last update |

**Relationships:**

- `Role → User` : One-to-Many (One role can have many users)  
- `Role → RolePermission` : One-to-Many (Role can have multiple permissions mapped)

---

## 3️⃣ Permission Table

**Table Name:** `Permission`  
**Purpose:** Defines all possible permissions in the system

| Column       | Type      | Description |
|-------------|-----------|-------------|
| permissionId | Int      | Primary key |
| name         | String   | Unique permission name |
| createdAt    | DateTime | Timestamp of creation |
| updatedAt    | DateTime | Timestamp of last update |

**Relationships:**

- `Permission → RolePermission` : One-to-Many (Permission can be assigned to multiple roles)  
- `Permission → UserPermission` : One-to-Many (Permission can be assigned to multiple users directly)

---

## 4️⃣ RolePermission Table

**Purpose:** Mapping table for Role → Permission (Many-to-Many via intermediate table)

| Column         | Type      | Description |
|----------------|-----------|-------------|
| rolePermissionId | Int     | Primary key |
| roleId          | Int     | FK to Role |
| permissionId    | Int     | FK to Permission |
| createdAt       | DateTime |
| updatedAt       | DateTime |

**Relationship type:** Many-to-Many between `Role` and `Permission` via `RolePermission`.

---

## 5️⃣ UserPermission Table

**Purpose:** Optional mapping of direct permissions to users (overrides or adds to role permissions)

| Column        | Type      | Description |
|---------------|-----------|-------------|
| id            | Int       | Primary key |
| userId        | Int       | FK to User |
| permissionId  | Int       | FK to Permission |
| createdAt     | DateTime  |
| updatedAt     | DateTime  |

**Relationship type:**  

- Many-to-Many between `User` and `Permission` via `UserPermission`.  
- Unique constraint: `[userId, permissionId]` ensures no duplicates.

---

## 6️⃣ Villa Table

**Purpose:** Stores all villas in the system

| Column       | Type      | Description |
|-------------|-----------|-------------|
| id          | Int       | PK, auto-increment |
| name        | String    | Name of villa |
| location    | String    | Villa location |
| price       | Int       | Price per night |
| maxGuests   | Int       | Maximum guests allowed |
| bedrooms    | Int       | Number of bedrooms |
| bathrooms   | Int       | Number of bathrooms |
| description | String    | Villa description |
| status      | Enum      | Villa status (AVAILABLE, OCCUPIED, MAINTENANCE) |
| createdAt   | DateTime  |
| updatedAt   | DateTime  |

**Relationships:**

- `Villa → VillaImage` : One-to-Many (Villa can have multiple images)  
- `Villa → VillaAmenity` : One-to-Many (Villa can have multiple amenities)  
- `Villa → Booking` : One-to-Many (Villa can have multiple bookings)  
- `Villa → Expense` : One-to-Many (Villa can have multiple expenses)

---

## 7️⃣ VillaImage Table

**Purpose:** Stores images for each villa  

| Column    | Type   | Description |
|-----------|--------|-------------|
| id        | Int    | PK |
| link      | String | Image URL |
| villaId   | Int    | FK to Villa |

**Relationship type:** Many-to-One with Villa

---

## 8️⃣ Amenity Table

**Purpose:** Defines all available amenities

| Column | Type   | Description |
|--------|--------|-------------|
| id     | Int    | PK |
| name   | Enum   | Amenity type (WIFI, POOL, etc.) |

**Relationship:** Many-to-Many with Villa via `VillaAmenity`

---

## 9️⃣ VillaAmenity Table

**Purpose:** Mapping table for Many-to-Many between Villa and Amenity

| Column    | Type | Description |
|-----------|------|-------------|
| villaId   | Int  | FK to Villa |
| amenityId | Int  | FK to Amenity |

**Constraints:** Composite PK: `[villaId, amenityId]`  
**Relationship type:** Many-to-Many

---

## 🔟 Booking Table

**Purpose:** Stores booking information  

| Column         | Type      | Description |
|----------------|-----------|-------------|
| id             | Int       | PK |
| guestName      | String    | Guest full name |
| guestEmail     | String    | Guest email |
| guestPhone     | String    | Guest phone |
| villaId        | Int       | FK to Villa |
| checkIn        | DateTime  | Check-in date |
| checkOut       | DateTime  | Check-out date |
| totalGuests    | Int       | Number of guests |
| specialRequest | String?   | Optional requests |
| bookingStatus  | Enum      | CONFIRMED, PENDING, etc. |
| paymentStatus  | Enum      | PAID, PENDING |
| createdAt      | DateTime  |
| updatedAt      | DateTime  |

**Relationships:**

- `Booking → Villa` : Many-to-One  
- `Booking → BookingExpense` : One-to-Many

---

## 11️⃣ Expense Table

**Purpose:** Tracks all expenses  

| Column    | Type      | Description |
|-----------|-----------|-------------|
| id        | Int       | PK |
| title     | String    | Expense title |
| amount    | Int       | Expense amount |
| date      | DateTime  | Expense date |
| type      | Enum      | SPLIT or INDIVIDUAL |
| category  | Enum      | Maintenance, Cleaning, etc. |
| villaId   | Int?      | Optional FK to Villa |
| createdAt | DateTime  |
| updatedAt | DateTime  |

**Relationships:**

- `Expense → Villa` : Many-to-One (optional)  
- `Expense → BookingExpense` : One-to-Many

---

## 12️⃣ BookingExpense Table

**Purpose:** Mapping table between Booking and Expense  

| Column    | Type  | Description |
|-----------|-------|-------------|
| id        | Int   | PK |
| bookingId | Int   | FK to Booking |
| expenseId | Int   | FK to Expense |
| amount    | Int   | Amount applicable for this booking |

**Relationships:**

- Many-to-Many between `Booking` and `Expense`  
- One booking can have multiple expenses, one expense can belong to multiple bookings

---

# Relationships Summary

| Table 1         | Table 2         | Type       |
|-----------------|----------------|------------|
| User            | Role            | Many-to-One |
| User            | UserPermission  | One-to-Many |
| Role            | RolePermission  | One-to-Many |
| Permission      | RolePermission  | One-to-Many |
| Permission      | UserPermission  | One-to-Many |
| Villa           | VillaImage      | One-to-Many |
| Villa           | VillaAmenity    | One-to-Many |
| Villa           | Booking         | One-to-Many |
| Villa           | Expense         | One-to-Many |
| Villa           | Amenity         | Many-to-Many via VillaAmenity |
| Booking         | BookingExpense  | One-to-Many |
| Expense         | BookingExpense  | One-to-Many |

---

# ✅ Key Points / Design Notes

1. **Roles & Permissions:** Flexible M:N mapping for both role-permission and user-permission. Admin can assign default role permissions or override per user.  
2. **Villa Management:** Villas are fully customizable with images, amenities, and expenses.  
3. **Booking Management:** Bookings are linked to villas, and expenses can be split across bookings.  
4. **Extensible Design:** Adding new roles, permissions, amenities, or villas is easy without altering the schema.  