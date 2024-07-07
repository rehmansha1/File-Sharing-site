import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import CryptoJS from "crypto-js";
import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState("");
  const [passofreciver, setPassofreciver] = useState("");
  const [idofreciver, setidofreciver] = useState("");
  const [irr, setreturnedreceiver] = useState(false);
  const [id, setid] = useState("");
  const [typeofurl, settypeofurl] = useState("");
  const [value, setvalue] = useState(false);
  const [previewFile, setfile] = useState("");
  const [invalid, setinvalid] = useState(false);
  const [gettingreq, setgettingreq] = useState(false);
  const [gettingreqreceiver, setgettingreqreceiver] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [textToCopy, setTextToCopy] = useState("");

  const handleFileChange = (event) => {
    setid("");
    setSelectedFile(event.target.files[0]);
  };
  const sendfile = async () => {
    setid("");
    setgettingreq(true);
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    var enpassword = CryptoJS.AES.encrypt(
      password,
      import.meta.env.VITE_ENCRPYT_KEY_ENV
    );
    formData.append("password", enpassword);

    const res = await axios.post(
      "https://file-sharing-site-server.onrender.com/putFile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setid(res.data.id);
    if (res.data.id) {
      setgettingreq(false);
    }
  };
  const receiveFile = async (id, password) => {
    setgettingreqreceiver(true);
    const data = {
      id,
      password,
    };

    const res = await axios
      .post(`https://file-sharing-site-server.onrender.com/getFile`, data)
      .then(
        (res) => {
          console.log("dawd");
          setgettingreqreceiver(false);

          setinvalid(false);

          return res;
        },
        () => {
          console.log("dawd");
          setgettingreqreceiver(false);
          setinvalid(true);
        }
      );

    const tag = document.createElement("a");
    tag.href = res.data;
    tag.style.display = "none";
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
    setreturnedreceiver(true);
  };
  const deleteFile = async (id) => {
    const res = await axios
      .post(`https://file-sharing-site-server.onrender.com/deleteFile`, {
        id: id,
      })
      .then(setreturnedreceiver(false));
  
    };

  useEffect(() => {
    const startup = async () => {
      const res = await axios.get(
        "https://file-sharing-site-server.onrender.com/"
      );
    };
    startup();
  }, []);
  return (
    <>
      <div id="wholepage">
        <div id="box">
          <div id="sender">
            <div id="outerwelcomebox">
              <div id="innerwelcomebox">
                <div id="welcomebox">Welcome to File Sharing Web</div>
                {!value && <div> want to receive a file? </div>}
                {value && <div> want to send a file? </div>}
              </div>
              <div
                className="sendbt12"
                onClick={() => {
                  const sender = document.getElementById("sender");
                  const receiver = document.getElementById("receiver");
                  sender.classList.toggle("active");

                  receiver.classList.toggle("active");
                  setTimeout(() => setvalue(!value), 250);
                }}
              >
                {!value ? "Receive" : "Send"}
              </div>
            </div>
          </div>
          <div id="receiver">
            {!value && (
              <div className="senderbox">
                <div className="h1sender">Sender</div>
                <div className="nox">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    class="inputfile"
                    onChange={(event) => {
                      handleFileChange(event);
                      setfile(event.target.files[0].name);
                    }}
                  />
                  <label for="file">Choose a file</label>
                  <input
                    className="inputboxsender"
                    placeholder="Create Password "
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                  {previewFile && (
                    <div className="idofsender">
                      {previewFile.split(".")[0].length > 14
                        ? previewFile.split(".")[0].slice(0, 10) +
                          ".. ." +
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
                              onClick={() => {
                        
                              }}
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
                    password && previewFile ? sendfile() : null;
                  }}
                >
                  {gettingreq ? (
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
            {value && (
              <div className="senderbox">
                <div className="h1sender">Receiver</div>
                <div className="nox">
                  <input
                    className="inputboxsender"
                    placeholder="Enter ID "
                    value={idofreciver}
                    onChange={(event) => {
                      setidofreciver(event.target.value);
                    }}
                  />
                  <input
                    className="inputboxsender"
                    placeholder="Enter Password "
                    value={passofreciver}
                    onChange={(event) => {
                      setPassofreciver(event.target.value);
                    }}
                  />
                </div>
                {invalid ? <div id="empty">Invalid ID or Password</div> : null}

                {irr && !invalid && (
                  <>
                    {" "}
                    <div id="tooltip">
                      <svg
                        onClick={() => deleteFile(idofreciver)}
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
                    idofreciver && passofreciver
                      ? receiveFile(idofreciver, passofreciver)
                      : null
                  }
                >
                  {gettingreqreceiver ? (
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
            setPassword(event.target.value);
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
            password ? sendfile() : null;
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
            setidofreciver(event.target.value);
          }}
        />
        <input
          placeholder="Password"
          onChange={(event) => {
            setPassofreciver(event.target.value);
            console.log(passofreciver);
          }}
        />
        {irr && (
          <a onClick={() => deleteFile(id)}>click to delete from server</a>
        )}

        <div
          id="sendbt"
          onClick={() => {
            receiveFile(idofreciver, passofreciver);
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
