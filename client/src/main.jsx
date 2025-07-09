import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router/dom";
import {router} from "./routes.jsx";
import {AuthContextProvider} from "./Context/AuthContext.jsx";
import {CartContextProvider} from "./Context/CartContext.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <AuthContextProvider>
        <CartContextProvider>
          <RouterProvider router={router}/>
        </CartContextProvider>
      </AuthContextProvider>
    </StrictMode>,
  </QueryClientProvider>
);