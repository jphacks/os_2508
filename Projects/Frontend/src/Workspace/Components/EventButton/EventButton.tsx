import "./EventButton.css"
type EventButton = {
eventName: string;
eventDate: string;
eventForm: string;
onClick: () => void;

}
const EventButton = ({eventName,eventDate,eventForm, onClick}: EventButton) => {
    return (
        <button onClick={onClick} className="EventButton">
            <h1>{eventName}</h1>
            <h2>{eventDate}</h2>
            <h3>{eventForm}</h3>
        </button>
    )
}
export default EventButton;
