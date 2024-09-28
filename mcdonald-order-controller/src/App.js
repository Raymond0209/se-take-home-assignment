import React, { useState, useEffect } from 'react';

let orderId = 1;
let botId = 1;

function App() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [bots, setBots] = useState([]);
  const [timeouts, setTimeouts] = useState({});

  // Function to add a new order
  const addOrder = (type) => {
    const newOrder = {
      id: orderId++,
      type: type,
    };

    if (type === 'vip') {
      setPendingOrders((prevOrders) => [
        ...prevOrders.filter((o) => o.type === 'vip'),
        newOrder,
        ...prevOrders.filter((o) => o.type === 'normal'),
      ]);
    } else {
      setPendingOrders((prevOrders) => [...prevOrders, newOrder]);
    }
  };

  // Function to add a new bot
  const addBot = () => {
    const newBot = {
      id: botId++,
      processingOrder: null,
    };

    setBots((prevBots) => [...prevBots, newBot]);
  };

  // Function to remove the latest bot
  const removeBot = () => {
    setBots((prevBots) => {
      const updatedBots = [...prevBots];
      const removedBot = updatedBots.pop();

      if (removedBot) {
        // If the bot was processing, move the order back to pending
        if (removedBot.processingOrder) {
          setPendingOrders((prevOrders) => [
            removedBot.processingOrder,
            ...prevOrders,
          ]);
        }

        // Clear the bot's timeout if it exists
        if (timeouts[removedBot.id]) {
          clearTimeout(timeouts[removedBot.id]);
          setTimeouts((prev) => {
            const newTimeouts = { ...prev };
            delete newTimeouts[removedBot.id];
            return newTimeouts;
          });
        }
      }

      return updatedBots;
    });
  };

  // Function to process orders by bots
  useEffect(() => {
    if (pendingOrders.length > 0) {
      // Only allow one bot to take an order at a time
      const idleBots = bots.filter((bot) => !bot.processingOrder);

      if (idleBots.length > 0) {
        const availableBot = idleBots[0];
        const order = pendingOrders[0];
        setPendingOrders((prevOrders) => prevOrders.slice(1));

        setBots((prevBots) =>
          prevBots.map((bot) =>
            bot.id === availableBot.id ? { ...bot, processingOrder: order } : bot
          )
        );

        const timeoutId = setTimeout(() => {
          setCompletedOrders((prevOrders) => [...prevOrders, order]);

          setBots((prevBots) =>
            prevBots.map((bot) =>
              bot.id === availableBot.id ? { ...bot, processingOrder: null } : bot
            )
          );

          // Clear the timeout
          setTimeouts((prevTimeouts) => {
            const updatedTimeouts = { ...prevTimeouts };
            delete updatedTimeouts[availableBot.id];
            return updatedTimeouts;
          });
        }, 10000);

        setTimeouts((prevTimeouts) => ({
          ...prevTimeouts,
          [availableBot.id]: timeoutId,
        }));
      }
    }
  }, [pendingOrders, bots]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">McDonald's Order Controller</h1>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => addOrder('normal')}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          New Normal Order
        </button>
        <button
          onClick={() => addOrder('vip')}
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-700"
        >
          New VIP Order
        </button>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={addBot}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          Add Bot
        </button>
        <button
          onClick={removeBot}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        >
          Remove Bot
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="order-section border-2 border-gray-300 rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">Pending Orders</h2>
          <ul className="list-none space-y-2">
            {pendingOrders.map((order) => (
              <li
                key={order.id}
                className="bg-gray-100 p-4 border border-gray-300 rounded shadow"
              >
                {order.type.toUpperCase()} Order #{order.id}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-section border-2 border-gray-300 rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">Completed Orders</h2>
          <ul className="list-none space-y-2">
            {completedOrders.map((order) => (
              <li
                key={order.id}
                className="bg-gray-100 p-4 border border-gray-300 rounded shadow"
              >
                {order.type.toUpperCase()} Order #{order.id}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bot-section mt-8 border-2 border-gray-300 rounded p-4">
        <h2 className="text-2xl font-semibold mb-4">Bots</h2>
        <ul className="list-none space-y-2">
          {bots.map((bot) => (
            <li
              key={bot.id}
              className={`p-4 border-2 rounded shadow font-bold text-white 
                ${bot.processingOrder ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700'}`}
            >
              {bot.processingOrder
                ? `🔄 Processing  ${bot.processingOrder.type.toUpperCase()} Order #${bot.processingOrder.id}`
                : `✅ Idle - Bot #${bot.id}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
