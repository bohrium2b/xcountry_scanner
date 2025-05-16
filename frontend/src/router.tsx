import { createHashRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { CreateEvent } from "./pages/CreateEvent.tsx";
import { ViewEvent } from "./pages/ViewEvent.tsx";

export const router = createHashRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/create-event",
        element: <CreateEvent />
    },
    {
        path: "/event/:id",
        element: <ViewEvent />

    },
    {
        path: "/event/:id/record",
        element: <div>Record Results</div>
    }
])

export const Router = () => {
    return (<RouterProvider router={router} />)
}