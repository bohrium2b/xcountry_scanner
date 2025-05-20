import { AppBar, Button, Typography, Box, Grid, TextField, Toolbar, IconButton } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCsrfToken, getRootUri } from "../utils";
import { type Event } from "../types";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type { Dayjs } from "dayjs";


export const CreateEvent = () => {
    const [event, setEvent] = useState<Event>({
        id: 0,
        name: "",
        description: "",
        date: "",
        location: ""
    });
    const [date, setDate] = useState<Dayjs | null>(null);
    const navigate = useNavigate();
    const handleDateChange = (newValue: Dayjs | null) => {
        setDate(newValue);
        if (newValue) {
            setEvent({ ...event, date: newValue.toISOString() });
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${getRootUri()}/api/events/`, {...event, id: null, date: event.date || ""}, {"headers": {'X-CSRFToken': getCsrfToken()}}).then(response => {
            if (response.status === 201) {
                navigate(`/event/${response.data.id}`);
            }
        }).catch(error => {
            console.error("Error creating event:", error);
        });
    }
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton component={Link} to={"/"} color="inherit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></IconButton>
                    <Typography variant="h6">
                        Event Management
                    </Typography>

                </Toolbar>
                
            </AppBar>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4">Create Event</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ padding: 2 }}>
                        <Grid size={{xs: 12}}>
                            <TextField fullWidth required label="Name" value={event.name} onChange={(e) => {setEvent({...event, name: e.target.value})}}/>
                        </Grid>
                        <Grid size={{xs: 12, lg: 12}}>
                            <TextField multiline required fullWidth label="Description" value={event.description} onChange={(e) => {setEvent({...event, description: e.target.value})}}/>
                        </Grid>
                        <Grid size={{xs: 12, lg: 12}}>
                            <TextField fullWidth required label="Location" value={event.location} onChange={(e) => {setEvent({...event, location: e.target.value})}}/>
                        </Grid>
                        <Grid size={{xs: 12, lg: 12}}>
                            <DateTimePicker
                                label="Date"
                                value={date}
                                onChange={handleDateChange}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid size={{xs: 12, lg: 12}}>
                            <Button type="submit" variant="contained" color="primary">Create Event</Button>
                        </Grid>
                    </Grid>

                </form>
            </Box>
        </>
    )
}