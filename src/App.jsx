import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import CryptoJS from "crypto-js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import FileSaver from "file-saver";
import ConfirmBox from "./components/ConfirmBox";
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [senderPassword, setSenderPassword] = useState("");
  const [receiverPassword, setReceiverPassword] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [isReceiverReturned, setIsReceiverReturned] = useState(false);
  const [id, setId] = useState("");
  const [isSender, setIsSender] = useState(false);
  const [previewFile, setfile] = useState("");
  const [invalid, setinvalid] = useState(false);
  const [isRequestInProgressForSender, setIsRequestInProgressForSender] = useState(false);
  const [IsRequestInProgressForReceiver, setIsRequestInProgressForReceiver] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [isTextOptionOn, setTextOption] = useState(false);
  const [textOptionInput,settextOptionInput] = useState("");
  const [textToCopy, setTextToCopy] = useState("");
  const [confirmBoxAlive, setConfirmBoxAlive] = useState(false);
  const [confirmBoxContents, setConfirmBoxContents] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    
    }
    handleResize();
  },[]);
  useEffect(() => {
    const setVhUnit = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    setVhUnit(); // Set on load
    window.addEventListener('resize', setVhUnit); // Update on resize

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', setVhUnit);
  }, []);
  const handleFileChange = async (event) => {
    setId("");
    if (event.target.files.length > 1) {
      const zip = new JSZip();
      for (var i = 0; i < event.target.files.length; i++) {
        zip.file(event.target.files[i].name, event.target.files[i]);
      }
      let content = await zip.generateAsync({ type: "blob" });
      const zipFile = new File(
        [content],
        `${event.target.files[0].name.split(".")[0]}`,
        { type: "application/zip" }
      );
      setSelectedFile(zipFile);
    } else {
      setSelectedFile(event.target.files[0]);

    }
  };
  const createTextFile = async() => {
    const element = document.createElement("a");
    const randomFileName = `file_${Math.random().toString(36).substring(2, 15)}.txt`;
    setSelectedFile();
    const file = new File([textOptionInput],  randomFileName,{ type: "text/plain"});

    await setSelectedFile(file);
    sendfile(file);

    setSelectedFile();
  };
  const sendfile = async (zipfile) => {
    setId("");
    setIsRequestInProgressForSender(true);
    const formData = new FormData();

    formData.append("selectedFile", selectedFile ? selectedFile : zipfile);

    var enpassword = CryptoJS.AES.encrypt(
      senderPassword.trim(),
      import.meta.env.VITE_ENCRPYT_KEY_ENV
    );
    formData.append("password", enpassword);

    if (isTextOptionOn){
      formData.append("text",true);
    }
    else{
      
    }

    const res = await axios.post(
      "https://file-sharing-site-server.onrender.com/putFile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setId(res.data.id);
    if (res.data.id) {
      setIsRequestInProgressForSender(false);
    }
  };
  const receiveFileOLD = async (id, password) => {
    setIsReceiverReturned(false);
    setIsRequestInProgressForReceiver(true);
    const data = {
      id,
      password,
    };

    const res = await axios
      .post(`https://file-sharing-site-server.onrender.com/getFile`, data)
      .then(
        (res) => {
         
          setIsRequestInProgressForReceiver(false);

          setinvalid(false);

          return res;
        },
        () => {
        
          setIsRequestInProgressForReceiver(false);
          setinvalid(true);
        }
      );

    const tag = document.createElement("a");
    tag.href = res.data;
    tag.style.display = "none";
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
    setIsReceiverReturned(true);
  };

  const receiveFile = async (id, password) => {
    setIsReceiverReturned(false);
    setIsRequestInProgressForReceiver(true);
    const data = {
      id,
      password,
    };

    const res = await axios
      .post(`https://file-sharing-site-server.onrender.com/getFile`, data)
      .then(
        (res) => {
          setIsRequestInProgressForReceiver(false);

          setinvalid(false);

          return res;
        },
        () => {
          setIsRequestInProgressForReceiver(false);
          setinvalid(true);
          
        }
      );

      try{
        const tag = document.createElement("a");
        tag.href = res.data.link;
        tag.style.display = "none";
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
        setIsReceiverReturned(true);
      }catch(error){
        console.log('error when receiving the file');
      }
      finally{
         setTimeout(() => {
          setIsReceiverReturned(true);
         }, 1500);  // find a way to make this dynamic

        

      }
  };
  const deleteFile = async (id) => {
    const res = await axios
      .post(`https://file-sharing-site-server.onrender.com/deleteFile`, {
        id: id,
      })
      .then(setIsReceiverReturned(false));
  };

  useEffect(() => {
    const startup = async () => {
      const res = await axios.get(
        "http://file-sharing-site-server.onrender.com/"
      );
    };
    startup();
  }, []);

  const downloadFile = async(link)=>{
    const tag = document.createElement("a");
    tag.href = link;
    tag.style.display = "none";
    document.body.appendChild(tag);

    tag.click();
    document.body.removeChild(tag);
    setIsRequestInProgressForReceiver(false);
  }
  return (
    <>

    {confirmBoxAlive && <ConfirmBox downloadFile ={downloadFile} setConfirmBoxContents={setConfirmBoxContents} confirmBoxContents={confirmBoxContents} setConfirmBoxAlive = {setConfirmBoxAlive} setIsRequestInProgressForReceiver={setIsRequestInProgressForReceiver} />}
      <div id="wholepage">
        <div id="box">
          <div id="sender">
            <div id="outerwelcomebox">
              <div id="innerwelcomebox">
                <div id="welcomebox">Welcome to File Sharing Web</div>
                {!isSender && <div> want to receive a file? </div>}
                {isSender && <div> want to send a file? </div>}
              </div>
              <div
                className="sendbt12"
                onClick={() => {
                  const sender = document.getElementById("sender");
                  const receiver = document.getElementById("receiver");
                  sender.classList.toggle("active");

                  receiver.classList.toggle("active");
                  setTimeout(() => setIsSender(!isSender), 250);
                }}
              >
                {!isSender ? "Receive" : "Send"}
              </div>
            </div>
          </div>
          <div id="receiver">
            {!isSender && (
              <div className="senderbox">
                <div className="h1sender">Sender</div>
                <div className="nox">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    class="inputfile"
                    multiple
                    onChange={(event) => {
                      handleFileChange(event);

                      setfile(event.target.files[0].name);
                    }}
                  />
                  {!isTextOptionOn ? (
                    <label for="file" id="fileid">
                      Choose a file
                    </label>
                  ) : (
                    <input className="inputboxsender" id="text-File-Input" value={textOptionInput} onChange={(event)=>settextOptionInput(event.target.value)} />
                  )}
                  {!isMobile &&
                  <>
                  <svg
                    id="options"
                    onClick={() => {
                      const textDrop = document.getElementById("text-drop");
                      textDrop.style.animation =
                        textDrop.style.animation.includes("appearTextDrop")
                          ? "ss 0.3s both"
                          : "appearTextDrop 0.3s both";
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                  >
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                  </svg>
                   
                  <div id="text-drop">
                    <div
                      onClick={() => {
                        setSelectedFile();
                        setId();
                        setfile();
                    
                        const fileLabel = document.getElementById('fileid');
                        if (fileLabel){
                          fileLabel.style.color = 'transparent';
                        } 
                        setTimeout(() => setTextOption(!isTextOptionOn), 300);
                      }}
                    >
                      {!isTextOptionOn ? 'Write Text' : 'Send File'}
                    </div>
                  </div></>
                   }{isMobile  &&
           
                   <svg
                    id="options"
                    onClick={() => {
                      setSelectedFile();
                        setId();
                        setfile();
                    
                        const fileLabel = document.getElementById('fileid');
                        if (fileLabel){
                          fileLabel.style.color = 'transparent';
                        } 
                        setTimeout(() => setTextOption(!isTextOptionOn), 300);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                  >
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                  </svg>}
     
                  <input
                    className="inputboxsender"
                    placeholder="Create Password "
                    value={senderPassword}
                    onChange={(event) => { 
                      setSenderPassword(event.target.value);
                    }}
                  />
                  {previewFile && (
                    <div className="idofsender">
                      {previewFile.split(".")[0].length > 22
                        ? previewFile.split(".")[0].slice(0, 10) +
                          "..." +
                          previewFile.split(".")[1]
                        : previewFile}
                    </div>
                  )}

                  {id && (
                    <>
                      {" "}
                      <div id="pss">
                        <div className="idofsender1" id="idofsender642">
                          ID {id}
                        </div>
                        <CopyToClipboard
                          text={id}
                          onCopy={() => {
                            document.getElementById("f").style.opacity = "1";
                            setTimeout(
                              () =>
                                (document.getElementById("f").style.opacity =
                                  " 0"),
                              2000
                            );
                          }}
                        >
                          <div id="copyclass">
                            <svg
                              id="copy"
                              onClick={() => {}}
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#A2A4A7"
                            >
                              <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                            </svg>{" "}
                            <div id="f">Copied!</div>
                          </div>
                        </CopyToClipboard>
                      </div>
                      {/* <div id="tooltip">
                        <svg
                          onClick={() => deleteFile(id)}
                          id="svgofsender"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#e8eaed"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      </div>
                     */}
                    </>
                  )}
                </div>
                <div
                  className="sendbt1"
                  onClick={() => {
                    if (isTextOptionOn){
                      senderPassword.trim() ? createTextFile() : null;
                     }
                     else{
                    senderPassword.trim() && previewFile ? sendfile() : null;
                     }
             
                  }}
                >
                  {isRequestInProgressForSender ? (
                    <svg
                      id="roundandround"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                    </svg>
                  ) : (
                    "Send"
                  )}
                </div>
              </div>
            )}
            {isSender && (
              <div className="senderbox">
                <div className="h1sender">Receiver</div>
                <div className="nox">
                  <input
                    className="inputboxsender"
                    placeholder="Enter ID "
                    value={receiverId}
                    onChange={(event) => {
                      setReceiverId(event.target.value);
                    }}
                  />
                  <input
                    className="inputboxsender"
                    placeholder="Enter Password "
                    value={receiverPassword}
                    onChange={(event) => {
                      setReceiverPassword(event.target.value);
                    }}
                  />
                </div>
                {invalid ? <div id="empty">Invalid ID or Password</div> : null}

                {isReceiverReturned && !invalid && (
                  <>
                    {" "}
                    <div id="tooltip">
                      <svg
                        onClick={() => deleteFile(receiverId)}
                        id="svgofsender"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                    </div>
                  </>
                )}
                <div
                  className="sendbt1"
                  onClick={() =>
                    receiverId && receiverPassword
                      ?   receiveFileOLD(receiverId,receiverPassword) 
                      : null
                  }
                >
                  {IsRequestInProgressForReceiver ? (
                    <svg
                      id="roundandround"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                    </svg>
                  ) : (
                    "Receive"
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*
    <div id="flex-prev">
      <div id="flex">
        <h2>File Uploader</h2>
        <input
          placeholder="Password"
          onChange={(event) => {
            setSenderPassword(event.target.value);
          }}
        />
        <input type="file" onChange={handleFileChange} />
        {id && <a target="_blank">your id is {id} </a>}
        {id && (
          <a onClick={() => deleteFile(id)}>click to delete from server</a>
        )}
        <div
          id="sendbt"
          onClick={() => {
            senderPassword ? sendfile() : null;
          }}
        >
          <div>Send</div>
        </div>
      </div>
      <div id="flex">
        <h2>File Receiver</h2>
        <input
          placeholder="Id"
          onChange={(event) => {
            setreceiverId(event.target.value);
          }}
        />
        <input
          placeholder="Password"
          onChange={(event) => {
            setReceiverPassword(event.target.value);
            console.log(receiverPassword);
          }}
        />
        {isReceiverReturned && (
          <a onClick={() => deleteFile(id)}>click to delete from server</a>
        )}

        <div
          id="sendbt"
          onClick={() => {
            receiveFile(receiverId, receiverPassword);
          }}
        >
          <div>Receive</div>
        </div>
      </div>
    </div>
    */}
    </>
  );
}

export default App;
