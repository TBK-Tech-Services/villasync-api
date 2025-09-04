# TBK Services DB Design
* This document provides a comprehensive overview of the database schema for the TBK Services.
* The schema is designed to manage villas, user roles, bookings, expenses, and amenities.

### **1. Schema Overview**

The schema is built around a set of interconnected tables that model the core entities of the system. The relationships between these tables are crucial for maintaining data integrity and enabling efficient queries. The key entities are:

* **Users**: Manages staff and admin accounts.

* **Villas**: Details about each rental property.

* **Bookings**: Information about guest reservations.

* **Expenses**: Tracks costs associated with villas and bookings.

* **Amenities**: Defines features available at villas.

### **2. Table Descriptions**

#### **`User`**

* **Description**: Stores information about system users, including staff and administrators.

* **Fields**:

  * `id`: Unique identifier for the user.

  * `firstName`, `lastName`: User's name.

  * `email`: User's unique email address.

  * `password`: Hashed password for secure authentication.

  * `role`: The user's role, defined by the `Role` enum (`ADMIN`, `STAFF`).

  * `createdAt`, `updatedAt`: Timestamps for creation and last update.

#### **`Villa`**

* **Description**: Holds details for each rental villa.

* **Fields**:

  * `id`: Unique identifier for the villa.

  * `name`, `location`: Basic villa information.

  * `price`: Rental price.

  * `maxGuests`, `bedrooms`, `bathrooms`: Property specifications.

  * `description`: A detailed description of the villa.

  * `status`: The current availability status, defined by the `Villa_Status` enum (`AVAILABLE`, `OCCUPIED`, `MAINTENANCE`).

  * `createdAt`, `updatedAt`: Timestamps for creation and last update.

#### **`VillaImage`**

* **Description**: Stores image links for each villa.

* **Fields**:

  * `id`: Unique identifier for the image.

  * `link`: The URL to the image file.

  * `villaId`: Foreign key linking to the `Villa` table.

#### **`Amenity`**

* **Description**: A lookup table for all available amenities.

* **Fields**:

  * `id`: Unique identifier for the amenity.

  * `name`: The amenity's name, from the `Amenities` enum (`WIFI`, `POOL`, etc.).

#### **`VillaAmenity`**

* **Description**: This is a **join table** that links `Villa` and `Amenity` in a many-to-many relationship.

* **Fields**:

  * `villaId`: Foreign key linking to the `Villa` table.

  * `amenityId`: Foreign key linking to the `Amenity` table.

  * **Primary Key**: A composite key of `(villaId, amenityId)` ensures each villa-amenity pair is unique.

#### **`Booking`**

* **Description**: Records guest bookings for villas.

* **Fields**:

  * `id`: Unique identifier for the booking.

  * `guestName`, `guestEmail`, `guestPhone`: Guest contact details.

  * `villaId`: Foreign key linking to the booked `Villa`.

  * `checkIn`, `checkOut`: The booking period.

  * `totalGuests`: Number of guests.

  * `specialRequest`: Optional field for any guest requests.

  * `bookingStatus`: Current status of the booking, from the `Booking_Status` enum.

  * `paymentStatus`: Payment status, from the `Payment_Status` enum.

  * `createdAt`, `updatedAt`: Timestamps for creation and last update.

#### **`Expense`**

* **Description**: Tracks costs associated with the business. Expenses can be linked to a specific villa or be general.

* **Fields**:

  * `id`: Unique identifier for the expense.

  * `title`, `amount`: Expense details.

  * `date`: The date the expense occurred.

  * `type`: Expense type, from the `Expense_Type` enum (`SPLIT`, `INDIVIDUAL`).

  * `category`: Expense category, from the `Expense_Category` enum.

  * `villaId`: Optional foreign key linking to a `Villa`.

  * `createdAt`, `updatedAt`: Timestamps for creation and last update.

#### **`BookingExpense`**

* **Description**: This is a **join table** that links `Booking` and `Expense` in a many-to-many relationship.

* **Fields**:

  * `id`: Unique identifier for the join record.

  * `bookingId`: Foreign key linking to the `Booking` table.

  * `expenseId`: Foreign key linking to the `Expense` table.

  * `amount`: The specific amount of the expense being applied to this booking.

### **3. Relationship Details**

Here is a breakdown of the key relationships in the schema:

| Relationship Name | Tables Involved | Relationship Type | Description |
|---|---|---|---|
| Villa Images | `Villa` & `VillaImage` | One-to-Many | A single villa can have multiple images associated with it. |
| Villa Bookings | `Villa` & `Booking` | One-to-Many | One villa can have many bookings over time. |
| Villa Expenses | `Villa` & `Expense` | One-to-Many (Optional) | One villa can have multiple expenses. The link is optional. |
| Villa Amenities | `Villa` & `Amenity` | Many-to-Many | A villa can have multiple amenities, and an amenity can be in multiple villas. This is handled by the `VillaAmenity` join table. |
| Booking Expenses | `Booking` & `Expense` | Many-to-Many | A booking can have multiple expenses, and an expense can be split across multiple bookings. This is handled by the `BookingExpense` join table. |

### **4. Enums**

The schema uses enums to constrain field values, ensuring data consistency and validity.

* `Role`: `ADMIN`, `STAFF`

* `Villa_Name`: `VILLA_1` through `VILLA_6`

* `Booking_Status`: `CONFIRMED`, `PENDING`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`

* `Villa_Status`: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`

* `Expense_Type`: `SPLIT`, `INDIVIDUAL`

* `Expense_Category`: `MAINTENANCE`, `CLEANING`, `MARKETING`, `UTILITIES`, `OTHERS`

* `Amenities`: `WIFI`, `POOL`, `PARKING`, `BEACH_ACCESS`, `KITCHEN`, `AC`, `TV`, `BALCONY`

* `Payment_Status`: `PAID`, `PENDING`