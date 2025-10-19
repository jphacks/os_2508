import './EventEdit.css';
import SeveralButton from "../../Components/SeveralButton/SeveralButton";
//import InputArea from "../../Components/InputArea/InputArea";
import BaseButton from "../../Components/BaseButton/BaseButton";
import InputField from "../../Components/InputField/InputField";


function EventEdit() {
    return (
        <div className="EditBackground">
            <div className="EditField">
                <div className="EditName">
                    <p>イベント名</p>
                    <InputField name="eventname" type="text" placeholder="eventname" />
                </div>
                <div className="EditExplain">
                    <p>詳細</p>
                    <InputField name="introduction" type="text" placeholder="introduction" />
                </div>
                <div className="EditDate">
                    <p>日時</p>
                    <InputField name="startdatetime" type="text" placeholder="startdatetime" />
                </div>
                <div className="EditFormat">
                    <p>開催形態</p>
                    <InputField name="methood" type="text" placeholder="methood" />
                </div>
                <div className="EditFee">
                    <p>参加費</p>
                    <InputField name="entryfee" type="text" placeholder="entryfee" />
                </div>
                <div className="Editlication">
                    <p>申し込み期間</p>
                    <InputField name="applicationlimit" type="text" placeholder="applicationlimit" />
                </div>
                <div className="EditCancel">
                    <p>キャンセル期間</p>
                    <InputField name="cancellimit" type="text" placeholder="cancellimit" />
                </div>
                <div className="EditAddress">
                    <p>運営連絡先</p>
                    <InputField name="contact" type="text" placeholder="contact" />
                </div>
                <div className="EditStaff">
                    <p>運営スタッフ名</p>
                    <InputField name="proposal" type="text" placeholder="proposal" />
                </div>
                <div className="EditButton">
                    <SeveralButton label="Save" onClick={() => alert("保存")} />
                </div>
            </div>
            <div className="EditHomeButton">
                <BaseButton label="Home" onClick={() => window.location.href = "/Home"} type="button" />
            </div>
        </div>
    );
}

export default EventEdit;