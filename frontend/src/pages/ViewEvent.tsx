import { AppBar, Button, Typography, Box, Toolbar, IconButton, Table, TableCell, TableHead, TableBody, TableRow, TableContainer, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getRootUri } from "../utils";
import { type Event, type Result } from "../types";
import axios from "axios";
import dayjs from "dayjs";

export const ViewEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event>({ "name": "", "date": "0000 00 00", "id": Number(id), "location": "Nowhere", "description": "" });
    const [results, setResults] = useState<Result[]>([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const navigate = useNavigate();
    // Get event
    useEffect(() => {
        axios.get(`${getRootUri()}/api/events/${id}/`).then((response) => {
            if (!response) {
                return (<p>Error: No response returned.</p>)
            } else if (response.status !== 200) {
                return (<p>Error: Event returned status {response.status}.</p>)
            }
            setEvent(response.data);
        })
    }, [id]);
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`${getRootUri()}/api/events/${id}/get_results/`).then((response) => {
                if (!response) {
                    setResults([]);
                } else {
                    setResults(response.data);
                }
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [id])
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton component={Link} to={"/"} color="inherit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg></IconButton>
                    <Typography variant="h6">
                        Event Management
                    </Typography>

                </Toolbar>

            </AppBar>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4">Viewing Event {event.name}</Typography>
                <Paper>
                    <Box sx={{ padding: 2 }}>
                        <Typography variant="h6">Event Details</Typography>
                        <Typography variant="body1">Description: {event.description}</Typography>
                        <Typography variant="body1">Date: {dayjs(event.date).format('D MMMM, YYYY')}</Typography>
                        <Typography variant="body1">Location: {event.location}</Typography>
                        <Typography variant="body1">ID: {event.id}</Typography>
                    </Box>

                </Paper>
                <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#FBFBFB", borderRadius: 2 }}>
                    <Button component={Link} to={`record`} sx={{margin: 1}}>Record Results</Button>
                    <Button color="error" variant="contained" sx={{margin:1}} onClick={() => {
                        // Show a dialog box
                        setDeleteDialog(true);
                    }}>Delete</Button>
                </Box>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Place</TableCell>
                                <TableCell>Student ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell>{result.num}</TableCell>
                                    <TableCell>{result.id}</TableCell>
                                </TableRow>
                            ))}
                            {results.length == 0 && (
                                <TableRow><TableCell><Typography>No results recorded yet.</Typography></TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={deleteDialog}>
                    <DialogTitle>
                        Delete Event {event.name}?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this event with {results.length} completed results? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {setDeleteDialog(false)}} color="primary" variant="contained">Cancel</Button>
                        <Button onClick={() => { axios.delete(`${getRootUri()}/api/events/${event.id}/`); navigate("/") }} color="error" variant="contained">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    )
}