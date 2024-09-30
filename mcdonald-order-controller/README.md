# McDonald's Order Controller

This is a simple React app that simulates McDonald's order processing using automated bots. Bots will pick up orders and process them for 10 seconds before marking them as complete. VIP orders are given priority over normal orders.

## Features

- **Add Normal Orders**: Add a normal customer order.
- **Add VIP Orders**: Add a VIP customer order, which gets priority over normal orders.
- **Add Bots**: Add automated bots to process orders.
- **Remove Bots**: Remove bots even while they are processing orders. If removed mid-process, the order goes back to the pending list.
- **Bot Behavior**: Bots process one order at a time (10 seconds per order).

## Installation

To run this project on your local machine, follow these steps:

1. **Clone the repository**:
   If you haven't already cloned the repository, you can do so by running:

   ```bash
   git clone <repository-url>

2. **Navigate to the project directory**:
    ```bash
    cd <project-directory>

3. **Install dependencies**:
    ```bash
    npm i

4. **Start the application**:
    ```bash
    npm start

5. **Open the app**:
    ```bash
    http://localhost:3000