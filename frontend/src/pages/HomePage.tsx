import axios from "axios";
import { AppBar, Typography, Box, Button, Toolbar, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react"
import { useEffect } from "react";
import { getRootUri } from "../utils";
import { type Event } from "../types";
import { Grid } from "@mui/material";
import dayjs from "dayjs";

export const HomePage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    // Get events from /api/events/
    const getEvents = useEffect(() => {
        axios.get(`${getRootUri()}/api/events/`).catch(error => {
            console.error("Error fetching events:", error);
        }).then(response => {
            if (!response) {
                console.error("Error fetching events: No response");
                return;
            }
            if (response.status !== 200) {
                console.error("Error fetching events:", response.status);
                return;
            }
            setEvents(response.data);
        }
        )
    }, []);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>Event Management</Typography>
                    <Button component={Link} to="/create-event" color="inherit">Create Event</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4">Events</Typography>
                <Grid container spacing={2}>
                    {events.map((event) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                            <Box key={event.id} sx={{ margin: 2, padding: 2, border: "2px solid rgb(201, 201, 201)", borderRadius: 2 }}>
                                <Typography variant="h5">{event.name}</Typography>
                                <Typography variant="body1">{event.description}</Typography>
                                <Typography variant="body2">Date: {dayjs(event.date).format('D[th] MMMM, YYYY')}</Typography>
                                <Typography variant="body2">Location: {event.location}</Typography>
                                <Button component={Link} to={`/event/${event.id}`} variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                    View Event
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )

}