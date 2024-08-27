// src/router/index.js ou src/router.js
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Private from "../pages/Private";
import RestaurantList from "../pages/Private/Restaurant/RestaurantList";
import RestaurantItems from "../pages/Private/Items/RestaurantItems";
import Order from "../pages/Private/Order/Order";
import RestaurantDashboard from "../pages/Private/Restaurant/RestaurantDashboard";
import EditRestaurant from "../pages/Private/Restaurant/EditRestaurant";
import ManageItemsRestaurant from "../pages/Private/Restaurant/ManageItensRestaurant";
import OrdersRestaurant from "../pages/Private/Restaurant/OrdersRestaurant";
import EditCustomer from "../pages/Private/Customer/EditCustomer";
import Register from "../pages/Private/Register/Register";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/cadastrar",
    element: <Register />
  },
  {
    path: "/",
    element: <Private />,
    children: [
      {
        index: true,
        element: <RestaurantList />
      },
      {
        path: "cliente/perfil",
        element: <EditCustomer />
      },
      {
        path: "cliente/restaurante/items",
        element: <RestaurantItems />
      },
      {
        path: "cliente/pedidos",
        element: <Order />
      },
      {
        path: "restaurante",
        element: <RestaurantDashboard />
      },
      {
        path: "restaurante/perfil",
        element: <EditRestaurant />
      },
      {
        path: "restaurante/gerenciar/itens",
        element: <ManageItemsRestaurant />
      },
      {
        path: "restaurante/pedidos",
        element: <OrdersRestaurant />
      }
    ],
  },
]);

export default router;
