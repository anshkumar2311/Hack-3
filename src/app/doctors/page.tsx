"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { MapPin, User2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Doctor {
    id: string;
    name: string;
    vicinity: string;
    //   specialty: string;
    distance: number;
    //   image: string;
}

const specialties = [
    "All Doctors",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Dermatologist",
    "Orthopedist",
    "Family Medicine",
    "Internal Medicine",
    "Psychiatrist",
];


export default function Home() {
    const [radius, setRadius] = useState([10]);
    //   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [specialty, setSpecialty] = useState("");


    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLoading(false);
                }
            );
        }
    }, []);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    //   const [doctors, setDoctors] = useState<{ place_id: string; name: string }[]>([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);
    useEffect(() => {
        async function getDoctors(latitude: number, longitude: number, doctorType: string, radius: number) {
            if (!location) return;

            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude, doctorType, radius }),
            });

            const data = await response.json();
            if (!data) return;
            console.log(data.results);

            const filtered = data.results.map((doctor: any) => {
                try {
                    if (doctor.business_status !== "OPERATIONAL") return;
                    return {
                        id: doctor.place_id,
                        name: doctor.name,
                        // specialty: doctor.types.join(", "),
                        vicinity: doctor.vicinity,
                        distance: getDistanceFromLatLonInMiles(location.lat, location.lng, doctor.geometry.location.lat, doctor.geometry.location.lng),
                        // image: doctor?.photos[0]?.photo_reference,
                    }
                } catch (e) {
                    return null;
                }
            });
            console.log(filtered);
            setDoctors(filtered);
        }
        if (!location) return;
        getDoctors(location.lat, location.lng, specialty, radius[0]);
    }, [radius, location, specialty]);

    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Find Doctors Near You</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Discover qualified healthcare professionals in your area. Adjust the search radius to expand or narrow your search.
                        </p>
                    </div>

                    {/* Location Status */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {loading ? (
                            "Detecting your location..."
                        ) : location ? (
                            "Location detected"
                        ) : (
                            "Unable to detect location"
                        )}
                    </div>
                    {/* Specialty Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Specialty</label>
                        <Select value={specialty} onValueChange={setSpecialty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                {specialties.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Radius Slider */}
                    <div className="space-y-4 max-w-md mx-auto">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Search Radius</label>
                            <span className="text-sm text-muted-foreground">{radius[0]} miles</span>
                        </div>
                        <Slider
                            value={radius}
                            onValueChange={setRadius}
                            min={1}
                            max={50}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Doctor List */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {doctors.map((doctor) => (
                            <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src='/globe.svg'
                                        alt={doctor.name}
                                        className="object-cover w-full h-48"
                                    />
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{doctor.name}</h3>
                                            <p className="text-sm text-muted-foreground">{doctor.vicinity}</p>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {doctor.distance.toFixed(2)} mi
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {doctors.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <User2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No doctors found</h3>
                            <p className="text-muted-foreground">
                                Try increasing the search radius to see more results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
function getDistanceFromLatLonInMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
