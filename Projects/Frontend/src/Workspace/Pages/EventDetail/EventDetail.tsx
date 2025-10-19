import './EventDetail.css';
import SeveralButton from "../../Components/SeveralButton/SeveralButton";
import BaseButton from "../../Components/BaseButton/BaseButton";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

// Eventデータの型を定義
interface EventData {
    EventID: string;
    EventName: string;
    StartDateTime: string;
    EndDateTime: string;
    Place: string;
    Method: string;
    EntryFee: number;
    Introduction: string;
    Sponsor?: string;
    Discord?: string;
    Target?: string;
    Contact?: string;
    DetaillicationLimit: string;
    CancelLimit: string;
    Proposal?: any;
}

function EventDetail() {
    const { EventID } = useParams<{ EventID: string }>();
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isStaff, setIsStaff] = useState<number>(0);
    const [isAttend, setIsAttend] = useState<number>(0);
    const navigate = useNavigate();

    const handleApply = async () => {
        try {
            const res = await fetch(`/Event/${EventID}/Application`, {
            method: "GET",
            credentials: "include", // Cookieを送るために必要
            });

            console.log("Application Button");

            const data = await res.json();

            if (res.ok) {
            setIsAttend(data.isAttend); // 出席登録成功
            } else {
            console.log(data.message); // エラー内容
            }
        } catch (err) {
            console.log("通信エラー");
            console.error(err);
        }
    };

    const handleCancel = async () => {
        try {
            const res = await fetch(`/Event/${EventID}/Cancel`, {
            method: "GET",
            credentials: "include", // Cookieを送るために必要
            });

            console.log("Cancel Button");

            const data = await res.json();

            if (res.ok) {
            setIsAttend(data.isAttend); // 出席登録成功
            } else {
            console.log(data.message); // エラー内容
            }
        } catch (err) {
            console.log("通信エラー");
            console.error(err);
        }
    };

    useEffect(() => {
        fetch(`/Event/${EventID}/Fetch`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setEventData(data.EventsData[0]); // 1件だけ取得
                setIsStaff(data.isStaff);
                setIsAttend(data.isAttend);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [EventID]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!eventData) return <p>No data found</p>;

    return (
        <div className="DetailBackground">
            <div className="DetailField">
                <div className="DetailName">
                    <p>{eventData.EventName}</p>
                    {/* <p>eventData.EventName</p> */}
                </div>
                <div className="DetailBox">
                    <div className="DetailDetail">
                        <p>詳細</p>
                        <p>{eventData.Introduction}</p>
                        {/* <p>eventData.Introduction</p> */}
                    </div>
                    <div className="DetailDate">
                        <p>日時: {new Date(eventData.StartDateTime).toLocaleString()} ～ {new Date(eventData.EndDateTime).toLocaleString()}</p>
                        {/* <p>日時：</p> */}
                    </div>
                    <div className="DetailFormat">
                        <p>開催形態: {eventData.Method}</p>
                        {/* <p>開催形態：</p> */}
                    </div>
                    <div className="DetailFee">
                        <p>参加費: {eventData.EntryFee}円</p>
                        {/* <p>参加費</p> */}
                    </div>
                    <div className="Detaillication">
                        <p>申し込み期間: {new Date(eventData.DetaillicationLimit).toLocaleString()}</p>
                        {/* <p>申し込み期間</p> */}
                    </div>
                    <div className="DetailCancel">
                        <p>キャンセル可能期間: {new Date(eventData.CancelLimit).toLocaleString()}</p>
                        {/* <p>キャンセル可能期間</p>
                        <p>キャンセル可能期間</p>
                        <p>キャンセル可能期間</p>
                        <p>キャンセル可能期間</p>
                        <p>キャンセル可能期間</p> */}
                    </div>
                    <div className="DetailAddress">
                        <p>運営連絡先: {eventData.Contact}</p>
                        {/* <p>運営連絡先：</p> */}
                    </div>
                </div>
                {isStaff !== null && isStaff !== 0 ? (
                        <div className="DetailButton">
                            <SeveralButton label="Management" onClick={() => navigate(`/Event/${EventID}/ManagementEvent`)} />
                            <SeveralButton label="Edit" onClick={() => navigate(`/Event/${EventID}/EditEvent`)} />
                        </div>
                    ) : (
                    <div className="DetailButton">
                        {isAttend !== null && isAttend !== 0 ? (
                            <SeveralButton label="Cancel" onClick={handleCancel} />
                        ) : (
                            <SeveralButton label="Appllication" onClick={handleApply} />
                        )}
                    </div>
)}

            </div>
            <div className="DetailHomeButton">
                <BaseButton label="Home" onClick={() => navigate("/Home")} />
            </div>
        </div>
    );
}

export default EventDetail;