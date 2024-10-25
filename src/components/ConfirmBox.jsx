import React from "react";
import "./ConfirmBox.css";
export default function ConfirmBox({setConfirmBoxContents,downloadFile,confirmBoxContents,setConfirmBoxAlive,setIsRequestInProgressForReceiver}) {
  const pullConfirmBoxDown = ()=>{
    document.getElementById('confirmbox').style.animation = 'downdown 0.5s both';
    setTimeout(()=>{setConfirmBoxAlive(false);setIsRequestInProgressForReceiver(false);    setConfirmBoxContents();    },500) 
  }
  return (
    <div className="confirm-Box" id="confirmbox">
      <h1>the incoming file is "{confirmBoxContents.name}"</h1>
      <div>do you want to download it?</div>
      <div className="yesorno">
        <div onClick={() => downloadFile(confirmBoxContents.link).then(()=>pullConfirmBoxDown())}>Yes</div>
        <div onClick={()=> pullConfirmBoxDown()}>No</div>
      </div>
    </div>
  );
}
