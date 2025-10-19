import './Event.css';
import EventButton from "../../Components/EventButton/EventButton";
import BaseButton from "../../Components/BaseButton/BaseButton";
import ConfirmButton from "../../Components/ConfirmButton/ConfirmButton";
import InputField from "../../Components/InputField/InputField";
import { useEffect, useState } from "react";

interface EventData {
    EventName: string;
    EventID: string;
    StartDateTime: string;
    EndDateTime: string;
    EntryFee: number;
}

function Event() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [isOrganizer, setIsOrganizer] = useState<number>(0);

    useEffect(() => {
        fetch("/Event/Fetch", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setEvents(data.EventsData);
                setIsOrganizer(data.isOrganizer);
            })
            .catch(err => console.error(err));
    }, []);
    return (
        <div className="EventBackground">
            <div className="EventField">
                <div className="EventSearch">
                    <InputField name="search" type="text" placeholder="🔍" />
                    <div className="EventSearchButton" >
                        <ConfirmButton type="submit" label="search" />
                    </div>
                </div>
                {/* mapで表示 */}
                {/* {events.map((event) => (
                    <EventButton
                        key={event.EventID}
                        eventName={event.EventName}
                        eventDate={`${new Date(event.StartDateTime).toLocaleString()} ~ ${new Date(event.EndDateTime).toLocaleString()}`}
                        eventForm={event.EntryFee + "円"} // 例
                        onClick={() => window.location.href = `/Event/${event.EventID}`}
                    />

                ))}
                {isOrganizer === 1 && (
                    <BaseButton
                        label="Add Event"
                        onClick={() => alert("Hi")}
                    />
                )} */}


                <EventButton
                    key="fall2025"
                    eventName="AAA"
                    eventDate={`${new Date("2025-10-10 20:00:00").toLocaleString()} ~ ${new Date("2025-10-10 20:00:00").toLocaleString()}`}
                    eventForm={1000 + "円"} // 例
                    onClick={() => window.location.href = "/Event/fall2025"}
                />

                <EventButton
                    key="fall2025"
                    eventName="AAA"
                    eventDate={`${new Date("2025-10-10 20:00:00").toLocaleString()} ~ ${new Date("2025-10-10 20:00:00").toLocaleString()}`}
                    eventForm={1000 + "円"} // 例
                    onClick={() => window.location.href = "/Event/fall2025"}
                />

                <EventButton
                    key="fall2025"
                    eventName="AAA"
                    eventDate={`${new Date("2025-10-10 20:00:00").toLocaleString()} ~ ${new Date("2025-10-10 20:00:00").toLocaleString()}`}
                    eventForm={1000 + "円"} // 例
                    onClick={() => window.location.href = "/Event/fall2025"}
                />

                <EventButton
                    key="fall2025"
                    eventName="AAA"
                    eventDate={`${new Date("2025-10-10 20:00:00").toLocaleString()} ~ ${new Date("2025-10-10 20:00:00").toLocaleString()}`}
                    eventForm={1000 + "円"} // 例
                    onClick={() => window.location.href = "/Event/fall2025"}
                />

                <EventButton
                    key="fall2025"
                    eventName="AAA"
                    eventDate={`${new Date("2025-10-10 20:00:00").toLocaleString()} ~ ${new Date("2025-10-10 20:00:00").toLocaleString()}`}
                    eventForm={1000 + "円"} // 例
                    onClick={() => window.location.href = "/Event/fall2025"}
                />
            </div>
            <div className="EventAddButton">
                <BaseButton
                    label="Add Event"
                    onClick={() => alert("Hi")}
                />
            </div>
            <div className="EventHomeButton">
                <BaseButton label="Home" onClick={() => window.location.href = "/Home"} type="button" />
            </div>
        </div>

    );
}
export default Event;
