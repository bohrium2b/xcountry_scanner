import { createHashRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { RecordResults } from "./pages/RecordResults.tsx";
import {lazy} from "react";

const CreateEvent = lazy(() => import("./pages/CreateEvent.tsx"));
const ViewEvent = lazy(() => import("./pages/ViewEvent.tsx"));

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
        element: <RecordResults />
    }
])

export const Router = () => {
    return (<RouterProvider router={router} />)
}