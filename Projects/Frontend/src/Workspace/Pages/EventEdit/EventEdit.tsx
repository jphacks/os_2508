import './EventEdit.css';
import SeveralButton from "../../Components/SeveralButton/SeveralButton";
import InputArea from "../../Components/InputArea/InputArea";
import BaseButton from "../../Components/BaseButton/BaseButton";


function EventEdit() {
    return (
        <div className="EditBackground">
            <div className="EditField">
                <div className="EditName">
                    <p>イベント名</p>
                    <InputArea row={5} col={50} placeholder="イベント名" />
                </div>
                <div className="EditExplain">
                    <p>詳細</p>
                    <InputArea row={5} col={50} placeholder="詳細" />
                </div>
                <div className="EditDate">
                    <p>日時</p>
                    <InputArea row={5} col={50} placeholder="日時" />
                </div>
                <div className="EditFormat">
                    <p>開催形態</p>
                    <InputArea row={5} col={50} placeholder="開催形態" />
                </div>
                <div className="EditFee">
                    <p>参加費</p>
                    <InputArea row={5} col={50} placeholder="参加費" />
                </div>
                <div className="Editlication">
                    <p>申し込み期間</p>
                    <InputArea row={5} col={50} placeholder="申し込み期間" />
                </div>
                <div className="EditCancel">
                    <p>キャンセル期間</p>
                    <InputArea row={5} col={50} placeholder="キャンセル期間" />
                </div>
                <div className="EditAddress">
                    <p>運営連絡先</p>
                    <InputArea row={5} col={50} placeholder="運営連絡先" />
                </div>
                <div className="EditStaff">
                    <p>運営スタッフ名</p>
                    <InputArea row={5} col={50} placeholder="運営スタッフ名" />
                </div>
                <div className="EditButton">
                    <SeveralButton label="Save" onClick={() => alert("保存")} />
                </div>
            </div>
            <div className="EditHomeButton">
                <BaseButton label="Home" onClick={ () => window.location.href = "/Home" }/>
            </div>
        </div>
    );
}

export default EventEdit;