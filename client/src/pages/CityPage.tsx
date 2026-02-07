import { useState } from "react";
import { Link } from "react-router-dom";
import { searchCityByName } from "../api/city";
import GoogleMap from "../components/GoogleMap"

export default function CityPage() {

    const [cityname, setCityName] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [cityQuery, setCityQuery] = useState<string>("");

    async function onSubmit(e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        e.preventDefault();
        setStatus(null);

        try {
            const city = await searchCityByName(cityname);
            setStatus(`✅ Found city: ${city.regionName ?? cityname}, the average rent is:
                $${Math.round(city.rent)}`);

            const q = (city.regionName ?? cityname).trim();
            setCityQuery(q);
        } catch (err) {
            setStatus(`❌ ${(err as Error).message}`);
        }
    }

    return (
        <>
        <nav style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <Link to="/profile">Profile</Link>
        </nav>
        <div>
        <h2>Search City</h2>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
            City name
            <input value={cityname} onChange={(e) => setCityName(e.target.value)} />
            </label>

            <button type="submit">Search city</button>
        </form>

        {status && <p style={{ marginTop: 12 }}>{status}</p>}
        <GoogleMap query={cityQuery || "United States"} />
        </div>
        </>
    );
}
