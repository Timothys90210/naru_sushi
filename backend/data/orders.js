// backend/data/orders.js

const orders = [
  {
    id: 1,
    studentName: "Tim Serrano",
    room: "Room 420 - Serena Serrano",
    school: "Kelston Boys High School",
    date: "2025-10-02",
    items: [
      {
        name: "32pc Salmon Sushi Mix Platter",
        quantity: 3,
        customizations: ["Extra Kewpie Mayo Sauce"],
      },
    ],
  },
  {
    id: 2,
    studentName: "Eroh Chae",
    room: "Room 01 - Carol Chae",
    school: "Equippers School",
    date: "2025-10-20",
    items: [
      {
        name: "2pc Prawn Rice and Seaweed ball",
        quantity: 1,
        customizations: ["No Prawns"],
      },
    ],
  },
];

const menuItems = [
  { id: 1, name: "California Roll", category: "Sushi", price: 2.5 },
  { id: 2, name: "Salmon Plain Roll", category: "Sushi", price: 1.5 },
  { id: 3, name: "Prawn Rice and Seaweed ball", category: "Sushi", price: 3.5 },
  { id: 4, name: "Salmon Sushi Mix Platter", category: "Sushi", price: 54.99 },
];

//Allows this data to be available to other files
module.exports = { orders, menuItems };