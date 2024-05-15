import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import CryptoJS from "crypto-js";

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const sendfile = async () => {
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    var enpassword = CryptoJS.AES.encrypt(
      password,
      import.meta.env.VITE_ENCRPYT_KEY_ENV
    );
    formData.append("password", enpassword);

    const res = await axios.post("http://localhost:3001/putFile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res);
    setid(res.data.id);
    //rehmanuploader
  };
  const receiveFile = async (id, password) => {
    const data = {
      id,
      password,
    };

    const res = await axios.post(`http://localhost:3001/getFile`, data).then(
      (res) => {
        console.log('dawd')

        setinvalid(false)
        return res;

      },
      () => {
        console.log('dawd')
        setinvalid(true);
      }
    );

    const tag = document.createElement("a");
    tag.href = res.data;
    document.body.appendChild(tag);
    tag.click();
    setreturnedreceiver(true);
  };
  const deleteFile = async (id) => {
    const res = await axios.post(`http://localhost:3001/deleteFile`, {
      id: id,
    }).then(()=>window.location.reload());

  };

  return (
    <>
      <div id="wholepage">
        <div id="box">
          <div
            id="sender"
            onClick={() => {
              const sender = document.getElementById("sender");
              const receiver = document.getElementById("receiver");
              sender.classList.toggle("active");

              receiver.classList.toggle("active");
              setTimeout(() => setvalue(!value), 250);
            }}
          >
            <div id="outerwelcomebox">
              <div id="innerwelcomebox">
                <div id="welcomebox">Welcome to File Sharing Web</div>
                {!value && <div> want to receive a file? </div>}
                {value && <div> want to send a file? </div>}
              </div>
              <div className="sendbt12">{!value ? "Receive" : "Send"}</div>
            </div>
          </div>
          <div id="receiver">
            {!value && (
              <div className="senderbox">
                <div className="h1sender">Sender</div>
                <div className="nox">
                  <input
                    className="inputboxsender"
                    placeholder="Create Password "
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
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
                      <div className="idofsender">ID {id}</div>{" "}
                      <div id="tooltip">
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
                    </>
                  )}
                </div>
                <div
                  className="sendbt1"
                  onClick={() => {
                    console.log(password);
                    password && previewFile ? sendfile() : null;
                  }}
                >
                  Send
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
                {invalid ? 
                <div id="empty">
                Invalid ID or Password
                </div>

                : null}
                
                {irr && !invalid &&(
                    <>
                      {" "}
                      <div id="tooltip">
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
                    </>
                  )}
                <div
                  className="sendbt1"
                  onClick={() => idofreciver && passofreciver ? receiveFile(idofreciver, passofreciver) : null }
                >
                  Receive
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
