export const Building = [
    {
        id: "Building 1",
        name: "Building 1"
    },
    {
        id: "Building 2",
        name: "Building 2"
    },
    {
        id: "Building 3",
        name: "Building 3"
    }
]

export const Floor = [
    {
        id: "Basement Floor",
        name: "Basement Floor"
    },
    {
        id: "Ground Floor",
        name: "Ground Floor"
    },
    {
        id: "1st Floor",
        name: "1st Floor"
    },
    {
        id: "2nd Floor",
        name: "2nd Floor"
    }
]

export const Status = [
    {
        id: "In-Progress",
        name: "In-Progress"
    },
    {
        id: "Resolved",
        name: "Resolved"
    }
]

export const UserRole = [
    {
        id: "admin",
        name: "Admin"
    },
    {
        id: "employee",
        name: "Employee"
    },
    {
        id: "owner",
        name: "Owner"
    },
    {
        id: "manager",
        name: "Manager"
    },
    {
        id: "it_manager",
        name: "IT Department"
    }
]
export const VALID_ROLES = UserRole.map(role => role.id);