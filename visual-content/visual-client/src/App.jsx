import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
        {/* Visual hot notifications beautifully matched to zinc/dark interface */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#18181b", // zinc-900
              color: "#fff",
              border: "1px solid #27272a", // zinc-800
              borderRadius: "16px",
              fontSize: "13px",
              padding: "10px 16px",
            },
            success: {
              iconTheme: {
                primary: "#10b981", // emerald-500
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // red-500
                secondary: "#fff",
              },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
}

export default App;
