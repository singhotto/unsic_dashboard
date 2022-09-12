import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactNotificationAlert from "react-notification-alert";
import io from "socket.io-client";

import LoadingSpinner from "components/Otto/LoadingSpinner";
//REACT QR CODE
import QRCode from "react-qr-code";

//Multi Select
import Select from "react-select";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Row,
  Col,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
const socket = io()
function Whatsapp() {
  const notificationAlertRef = React.useRef(null);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("All");
  const [paese, setPaese] = useState([]);
  const [modal, setModal] = useState(false);
  const [clients, setClients] = useState(0);
  const [connected, setConnected] = useState(false);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [isLoadeding, setLoadeding] = useState(false);
  const [msg, setMsg] = useState("");
  const [count, setCount] = useState(0);
  const [update, setUpdate] = useState(false);
  const [qr, setQr] = useState("");

  useEffect(() => {
    setUpdate(false);
    async function getAllCities() {
      try {
        const res = await axios.get(`/all-cities`);
        if (res.data) {
          setAllCities(
            res.data[0].comune.map((city) => {
              return { value: city, label: city };
            })
          );
          setPaese(res.data[0].nazione.map((country) => country));
        }
      } catch (e) {
        console.log(e);
      }
    }
    async function getDefaultCities() {
      try {
        const res = await axios.get(`/cities`);
        if (res.data) {
          setCities(
            res.data.map((city) => {
              return { value: city.comune, label: city.comune };
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    }

    socket.on('done',()=>{
      notify("br",2,"All Msg Sent")
    })
    socket.on("getQr", (data) => {
      if (data) {
        setQr(data);
      }
    });
    socket.on("connected", ()=>{
      setConnected(true);
      setModal(false);
    });
    socket.on("disconnected", ()=>{
      setConnected(false);
      setModal(false);
    });
    socket.on('count', d=>setCount(d));
    socket.on('fuck',()=>console.log('fucked'))
    getDefaultCities();
    getAllCities();
    return () => {
      socket.off("getQr");
      socket.off("count");
      socket.off("disconnected");
      socket.off("connected");
    };
  }, [update]);

  //NOTIFICATIONS
  const notify = (place, type = 1, msg = "") => {
    switch (type) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        type = "primary";
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{msg}</div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  function handleCities(c, a) {
    if (a.action == "select-option") {
      setCities([...cities, a.option]);
    } else if ((a.action = "remove-value")) {
      setCities(cities.filter((city) => city.value != a.removedValue.value));
    }
  }

  async function handleCerca(e) {
    try {
      const selectedCities = cities.map((x) => x.value);
      const res = await axios
        .get(
          `/wpusers?comune=${selectedCities}&nazione=${country}`
        )
        .then((data) => {
          if (data.data.length == 0) {
            notify("br", 3, "Clients not found!!!");
          } else {
            setClients(data.data);
          }
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleConnect(e) {
    try {
      if(qr){
        setModal(!modal)
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleFile(e) {
    try {
      setFileName(e.target.files[0].name);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("fileName", fileName);
      const res = await axios.post("/file", formData);
      if (res.data.code == 200) {
        notify("br", 2, res.data.message);
        setUploaded(true);
      } else {
        notify("br", 4, res.data.message);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  async function handleSend(e) {
    try {
      const selectedCities = cities.map((x) => x.value);
      socket.emit('send', { nazione: country, msg, comune: selectedCities, fileName })
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <div className="content">
        <div className="react-notification-alert-container">
          <ReactNotificationAlert ref={notificationAlertRef} />
        </div>
        <Modal
          isOpen={modal}
          toggle={() => setModal(!modal)}
          className="sweet-alert"
        >
          <ModalHeader toggle={() => setModal(!modal)}>
            <i class="fa-brands fa-whatsapp"></i> SCAN QR CODE
          </ModalHeader>
          <ModalBody>
            <QRCode value={qr} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModal(!modal)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">FILTER USERS</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="12">
                      <FormGroup>
                        <label>Cities</label>
                        <Select
                          isMulti
                          name="colors"
                          options={allCities}
                          value={cities}
                          onChange={handleCities}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="dark">
                            {country ? country : "Select Country"}
                          </DropdownToggle>
                          <DropdownMenu
                            onClick={(e) =>
                              setCountry(e.target.firstChild.nodeValue)
                            }
                          >
                            <DropdownItem>All</DropdownItem>
                            {paese.map((x) => (
                              <DropdownItem>{x}</DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <Button
                          className="btn-fill"
                          color="info"
                          onClick={handleCerca}
                        >
                          Cerca
                        </Button>
                      </FormGroup>
                    </Col>
                    {qr && (
                      <Col className="pl-md-1" md="4">
                        <FormGroup>
                          <Button
                            className="btn-fill"
                            color="warning"
                            onClick={handleConnect}
                          >
                            Connect <i class="fa-brands fa-whatsapp"></i>
                          </Button>
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <br></br>
                        <Button className="secondry">
                          <Input
                            defaultValue=""
                            placeholder="Select JPG"
                            type="file"
                            onChange={handleFile}
                          />
                          {fileName ? fileName : "Select JPG"}
                        </Button>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>{isLoadeding && <LoadingSpinner />}</FormGroup>
                    </Col>
                  </Row>
                  <Row sm={10}>
                    <Col sm={10} md="12">
                      <Input
                        placeholder="WHATSAPP MSG HERE"
                        type="textarea"
                        onChange={(e) => setMsg(e.target.value)}
                        value={msg}
                        sm={10}
                        bsSize="lg"
                        size="lg"
                        style={{ height: "55rem" }}
                      />
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  className="btn-fill"
                  color="primary"
                  onClick={handleSend}
                  disabled={!connected}
                >
                  SEND MESSAGE
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                {connected?(
                  <h3 className="text-success">Connected To Whatsapp</h3>
                ):(<h3 className="text-success">Disconnetd from Whatsapp</h3>)}
                {clients > 0 && (
                  <h3 className="text-success">{clients} Clients Found</h3>
                )}
                {uploaded && <h3 className="text-success">File Uploaded</h3>}
                {count > 0 && (
                  <h1
                    className={`text-${
                      count < clients ? "warning" : "success"
                    }`}
                  >
                    {count} / {clients}
                  </h1>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

const Paese = ["India", "Pakistan", "Cina"];

export default Whatsapp;
