import { AppBar,  Typography, Box,  Toolbar, IconButton } from "@mui/material";

import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getRootUri, getCsrfToken } from "../utils";
import { type Event, type Result } from "../types";
import axios from "axios";
import toast, {Toaster} from 'react-hot-toast';
import { BarcodeScanner } from "react-barcode-scanner";
import 'barcode-detector/polyfill'

export const RecordResults = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event>({"name": "", "date": "0000 00 00", "id": Number(id), "location": "Nowhere", "description": ""});
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [number, setNumber] = useState<number>(1);
    const [results, setResults] = useState<Result[]>([]);
    const notify = (message: string) => {
        // Push a toast notification
        console.log(message);
        toast(message, {
            duration: 4000,
            position: 'bottom-left',
            style: {
                background: '#333',
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#fff',
            },
        });
    }
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
    // Get results
    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`${getRootUri()}/api/events/${id}/get_results/`).then((response) => {
                // Get the last number
                setNumber(response.data[response.data.length - 1].num + 1);
            });
        }, 10000);

        return () => clearInterval(interval);      
    }, [id]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (results.length <= 3) {
                return;
            }
            axios.post(`${getRootUri()}/api/events/${id}/post_results/`, results, {headers: {'X-CSRFToken': getCsrfToken()}}).then((response) => {
                if (response.status === 200) {
                    console.log("Results pushed successfully");
                    setResults([]);

                } else {
                    console.log("Error pushing results");
                    // Push a toast notification
                    notify("Error pushing results");
                }
            }).catch((error) => {
                console.log("Error pushing results: ", error);
                // Push a toast notification
                notify("Error pushing results");
            }
            );
        }, 2000);

        return () => clearInterval(interval);      
    }, [id, results]);

    useEffect(() => {
        setTimeout(() => {
            setScannedData(null);
        }, 2000);
    }, [scannedData])

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton component={Link} to={`/event/${event.id}`} color="inherit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg></IconButton>
                    <Typography variant="h6">
                        {event.name}
                    </Typography>

                </Toolbar>

            </AppBar>
            <Box sx={{ padding: 2 }}>
                <Box sx={{height: "50vh"}}>
                    <BarcodeScanner
                        onCapture={(barcodes) => {
                            barcodes.forEach((barcode) => {
                                console.log("Found barcode: ", barcode.rawValue)

                                if (results.some(result => result.id === Number(barcode.rawValue))) {
                                    console.log("Duplicate barcode detected, skipping...");
                                    return;
                                }
                                setScannedData(barcode.rawValue);
                                setResults([...results, { "id": Number(barcode.rawValue), "num": number ? number : 0 }]);
                                console.log(results);
                                setNumber(number + 1);
                            });
                        }}
                        options={{
                            formats: ["code_128"],
                            delay: 1000
                        }}
                    />
                </Box>
                
                {scannedData && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "green",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                        <Typography variant="h3" sx={{ color: "white", marginTop: 2 }}>
                            {scannedData} finished #{number}! Congratulations!
                        </Typography>
                    </Box>
                )}
                <Toaster 
                    position="bottom-left"
                />

            </Box>
        </>
    )
}