import { AppBar, Button, Typography, Box,  Toolbar, IconButton, Table, TableCell, TableHead, TableBody, TableRow, TableContainer, Paper } from "@mui/material";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getRootUri } from "../utils";
import { type Event, type Result } from "../types";
import axios from "axios";

export const RecordResults = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event>({"name": "", "date": "0000 00 00", "id": Number(id), "location": "Nowhere", "description": ""});
    const [results, setResults] = useState<Result[]>([])
    // Get event
    const getEvent = useEffect(() => {
        axios.get(`${getRootUri()}/api/events/${id}/`).then((response) => {
            if (!response) {
                return (<p>Error: No response returned.</p>)
            } else if (response.status !== 200) {
                return (<p>Error: Event returned status {response.status}.</p>)
            }
            setEvent(response.data);
        })
    }, [id]);
    const getResults = useEffect(() => {
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
                <Button component={Link} to={`record`}>Record Results</Button>
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
                            <Typography>No results recorded yet.</Typography>
                        )}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
        </>
    )
}