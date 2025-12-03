import React, { useMemo, useState } from "react";
import '../modul.css';
import { useNavigate } from "react-router-dom";

type Clinic = { id: string; name: string };
type Procedure = { id: string; name: string; clinicId: string };
type Doctor = { id: string; name: string; clinicId: string; procedureIds: string[] };

const styles: { [k: string]: React.CSSProperties } = {
   proceedButton: {
    
        minWidth: 160,
        padding: "10px 16px",
        fontSize: 15,
        fontWeight: 700,
        borderRadius: 10,
        border: "none",
        background: "#0ea5a4",
        color: "white",
        cursor: "pointer",
    },
    proceedButtonDisabled: {
        background: "#c7f3f1",
        color: "#7f9ca0",
        cursor: "not-allowed",
    },
};

export default function AppointmentForm(): React.ReactElement {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/calendar");
    };

    const clinics: Clinic[] = [
        { id: "c1", name: "Downtown Clinic" },
        { id: "c2", name: "Lakeside Health" },
    ];

    const procedures: Procedure[] = [
        { id: "p1", name: "General Checkup", clinicId: "c1" },
        { id: "p2", name: "Dermatology Visit", clinicId: "c1" },
        { id: "p3", name: "Dental Cleaning", clinicId: "c2" },
        { id: "p4", name: "Physical Therapy", clinicId: "c2" },
    ];

    const doctors: Doctor[] = [
        { id: "d1", name: "Dr. Alice Smith", clinicId: "c1", procedureIds: ["p1", "p2"] },
        { id: "d2", name: "Dr. Bob Jones", clinicId: "c1", procedureIds: ["p1"] },
        { id: "d3", name: "Dr. Carol Lee", clinicId: "c2", procedureIds: ["p3", "p4"] },
    ];

    const [clinicId, setClinicId] = useState<string>("");
    const [procedureId, setProcedureId] = useState<string>("");
    const [doctorId, setDoctorId] = useState<string>("");

    const availableProcedures = useMemo(
        () => procedures.filter((p) => p.clinicId === clinicId),
        [clinicId]
    );

    const availableDoctors = useMemo(
        () =>
            doctors.filter(
                (d) =>
                    d.clinicId === clinicId &&
                    (procedureId ? d.procedureIds.includes(procedureId) : true)
            ),
        [clinicId, procedureId]
    );

    return (
        <form className="form">
            <h2>Reserve Appointment</h2>

            <label>
                Clinic
                <br />
                <select value={clinicId} onChange={(e) => setClinicId(e.target.value)} className="select-box">
                    <option value="">-- choose clinic --</option>
                    {clinics.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </label>

            <div style={{ height: 8 }} />

            <label>
                Procedure
                <br />
                <select
                    value={procedureId}
                    onChange={(e) => setProcedureId(e.target.value)}
                    disabled={!clinicId}
                    className="select-box"
                >
                    <option value="">-- choose procedure --</option>
                    {availableProcedures.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </label>

            <div style={{ height: 8 }} />

            <label>
                Doctor
                <br />
                <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    disabled={!clinicId || !procedureId}
                    className="select-box"
                >
                    <option value="">-- choose doctor --</option>
                    {availableDoctors.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </label>

            <div style={{ height: 12 }} />
                    
            <button 
            type="button" 
            onClick={handleClick} 
            disabled={!clinicId || !procedureId || !doctorId} 
            style={{
                        ...styles.proceedButton,
                        ...(!clinicId || !procedureId || !doctorId ? styles.proceedButtonDisabled : {}),
                    }}
            >
                Continue
            </button>          
        </form>
    );
}

