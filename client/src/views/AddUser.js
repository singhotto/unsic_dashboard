import axios from "axios";
import React, { useState } from "react";
import ReactNotificationAlert from "react-notification-alert";
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
  Input,
  Label,
  Row,
  Col,
  ButtonGroup,
  CardTitle,
} from "reactstrap";

function codiceFISCALE(cfins) {
  var cf = cfins.toUpperCase();
  var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
  if (!cfReg.test(cf)) {
    return false;
  }

  var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
  var s = 0;
  for (let i = 1; i <= 13; i += 2)
    s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
  for (let i = 0; i <= 14; i += 2)
    s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
  if (s % 26 != cf.charCodeAt(15) - "A".charCodeAt(0)) return false;
  return true;
}

function AddUser() {
  const notificationAlertRef = React.useRef(null);
  const [cf, setCf] = useState("");
  const [cfOk, setCfOk] = useState(false);
  const [name, setName] = useState("");
  const [sname, setSname] = useState("");
  const [spid, setSpid] = useState(""); //spid
  const [pass, setPass] = useState(""); //spid-Pass
  const [tel, setTel] = useState("");
  const [ric, setRic] = useState(false);
  const [cit, setCit] = useState(false);
  const [pakIdCheck, setpakIdCheck] = useState(false);
  const [pakPassCheck, setpakPassCheck] = useState(false);
  const [dateRic, setDateRic] = useState("");
  const [dateCit, setDateCit] = useState("");
  const [pakId, setPakId] = useState(""); //pak
  const [emailPass, setEmailPass] = useState(""); //pak Passport
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");

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

  const handleCerca = async (e) => {
    if (cf) {
      try {
        const res = await axios
          .get(`https://unsicapi.azurewebsites.net/user/${cf}`)
          .then((data) => {
            if (!data.data) {
              notify("br", 3, "Client Not Found!!!");
            } else {
              const client = data.data;
              console.log(client);
              setSname(client.cognome);
              setName(client.nome);
              setCity(client.comune);
              setSpid(client.spid);
              setPass(client.PassSpid);
              setTel(client.telefono);
              setCit(client.cit);
              setRic(client.ric);
              setpakIdCheck(client.pakId);
              setpakPassCheck(client.pakPass);
              setDateRic(client.dataRic);
              setDateCit(client.dataCit);
              setPakId(client.idCardId);
              setEmailPass(client.pakPassId);
              setCountry(client.nazione);
              setNote(client.note);
              console.log(name, tel, country);
            }
          })
          .catch((e) => console.log(e));
      } catch (error) {
        console.log("line 74, " + error);
      }
    } else {
      notify("br", 4, "Please Insert Codice Fiscale!!!");
    }
  };

  async function handleUpdate(e) {
    try {
      if (!cf || !name || !sname) {
        notify("br", 4, "Codice Fiscale, nome, Cognome sono obbligatori!!!");
        return;
      } else if (!tel) {
        notify("br", 4, "Telefono obbligatoro!!!");
      } else if (!city) {
        notify("br", 4, "City obbligatoro!!!");
      } else if (!country) {
        notify("br", 4, "Country obbligatoro!!!");
      } else if (!codiceFISCALE(cf)) {
        notify("br", 4, "Codice Fiscale sbagliato!!!");
        return;
      } else {
        let res = await axios({
          method: "post",
          url: `https://unsicapi.azurewebsites.net/user/${cf}`,
          data: {
            cf,
            cognome: sname,
            nome: name,
            spid: spid,
            PassSpid: pass,
            telefono: tel,
            ric: ric,
            cit: cit,
            pakPass: pakPassCheck,
            pakId: pakIdCheck,
            dataRic: dateRic,
            dataCit: dateCit,
            idCardId: pakId,
            pakPassId: emailPass,
            comune: city,
            nazione: country,
            note: note,
          },
        });
        if (res.data) {
          notify("br", 2, "Client Updated Successfully!!!");
        }
      }
    } catch (error) {
      notify("br", 3, "Error");
      console.log(error);
    }
  }

  function handleCf(e) {
    setCf(e.target.value);
    if (!codiceFISCALE(e.target.value)) {
      setCfOk(false);
    } else {
      setCfOk(true);
    }
  }

  return (
    <>
      <div className="content">
        <div className="react-notification-alert-container">
          <ReactNotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">ADD USER</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Codice Fiscale</label>
                        <Input
                          defaultValue=""
                          placeholder="Codice Fiscale"
                          type="text"
                          valid={cfOk}
                          invalid={!cfOk}
                          onChange={handleCf}
                        />
                      </FormGroup>
                    </Col>

                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue=""
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue=""
                          placeholder="Last Name"
                          value={sname}
                          type="text"
                          onChange={(e) => setSname(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">Email Spid</label>
                        <Input
                          placeholder="unsic@email.com"
                          type="email"
                          value={spid}
                          onChange={(e) => setSpid(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                        <label>Password Spid</label>
                        <Input
                          defaultValue=""
                          placeholder="Password"
                          type="text"
                          value={pass}
                          onChange={(e) => setPass(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>Mobile Number</label>
                        <Input
                          defaultValue=""
                          placeholder="Number"
                          type="text"
                          value={tel}
                          onChange={(e) => setTel(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="px-md-2" md="12">
                      <label htmlFor="Action">Action: </label>
                      <div class="col-sm-10">
                        <div class="form-check form-check-inline">
                          <label class="form-check-label">
                            <Input
                              type="checkbox"
                              onClick={() => setRic(!ric)}
                              active={ric}
                              checked={ric}
                              class="form-check-input"
                            />
                            <span class="form-check-sign"></span>
                            Ricongiungimento Familiare
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <label class="form-check-label">
                            <Input
                              type="checkbox"
                              onClick={() => setCit(!cit)}
                              active={cit}
                              checked={cit}
                              class="form-check-input"
                            />
                            <span class="form-check-sign"></span>Cittadinanza
                            Italiana
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <label class="form-check-label">
                            <Input
                              type="checkbox"
                              onClick={() => setpakIdCheck(!pakIdCheck)}
                              active={pakIdCheck}
                              checked={pakIdCheck}
                              class="form-check-input"
                            />
                            <span class="form-check-sign"></span>Pakistan Id
                            Card
                          </label>
                        </div>
                        <div class="form-check form-check-inline">
                          <label class="form-check-label">
                            <Input
                              type="checkbox"
                              onClick={() => setpakPassCheck(!pakPassCheck)}
                              active={pakPassCheck}
                              checked={pakPassCheck}
                              class="form-check-input"
                            />
                            <span class="form-check-sign"></span>Pakistan
                            Passport
                          </label>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {pakPassCheck ? (
                    <Row>
                      <Col className="px-md-1" md="3">
                        <FormGroup>
                          <label>Pak Passport Id</label>
                          <Input
                            placeholder="unsic@email.com"
                            type="email"
                            value={emailPass}
                            onChange={(e) => setEmailPass(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  {pakIdCheck ? (
                    <Row>
                      <Col className="px-md-1" md="3">
                        <FormGroup>
                          <label>PakPass Id</label>
                          <Input
                            placeholder="unsic@email.com"
                            type="email"
                            value={pakId}
                            onChange={(e) => setPakId(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  {ric ? (
                    <Row>
                      <Col className="pl-md-1" md="4">
                        <FormGroup>
                          <label>Date of Ricongiungimento</label>
                          <Input
                            defaultValue="01/01/2022"
                            placeholder="Data inizio pratica"
                            type="Date"
                            value={dateRic}
                            onChange={(e) => setDateRic(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  {cit ? (
                    <Row>
                      <Col className="pl-md-1" md="4">
                        <FormGroup>
                          <label>Date of Citizenship</label>
                          <Input
                            defaultValue="01/01/2022"
                            placeholder="Data inizio pratica"
                            type="Date"
                            value={dateCit}
                            onChange={(e) => setDateCit(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          defaultValue="Boretto"
                          placeholder="City"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          defaultValue="Paksitan"
                          placeholder="Country"
                          value={country}
                          type="text"
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <label>Note:</label>
                        <Input
                          cols="80"
                          defaultValue=""
                          placeholder="Here can be anything"
                          rows="4"
                          type="textarea"
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="info" onClick={handleCerca}>
                  Cerca
                </Button>
                <Button
                  className="btn-fill"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddUser;
