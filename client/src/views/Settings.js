import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "components/Otto/LoadingSpinner";

//Multi Select
import Select from "react-select";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Progress,
} from "reactstrap";
import ReactNotificationAlert from "react-notification-alert";

function Settings() {
  const notificationAlertRef = React.useRef(null);
  const [cities, setCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [country, setCountry] = useState("");
  const [upload, setUpload] = useState(0);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setUpdate(false);
    async function getAllCities() {
      try {
        const res = await axios.get(`https://unsicapi.azurewebsites.net/all-cities`);
        if (res.data) {
          setAllCities(
            res.data[0].comune.map((city) => {
              return { value: city, label: city };
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
    async function getDefaultCities() {
      try {
        const res = await axios.get(`https://unsicapi.azurewebsites.net/cities`);
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
    async function getNumberOfClients() {
      try {
        const res = await axios.get(`https://unsicapi.azurewebsites.net/clients`);
        if (res.data) {
          notify("br", 2, `*** ${res.data} CLIENTS FOUND.***`)
        }
      } catch (e) {
        console.log(e);
      }
    }
    getNumberOfClients()
    getDefaultCities();
    getAllCities();
  }, [update]);

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

  function handleFile(e) {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }

  async function handleUpload(e) {
    if (!fileName) {
      notify("br", 4, "Please Upload a Contact file first!!!");
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      try {
        setLoading(true);
        const res = await axios.post("https://unsicapi.azurewebsites.net/read", formData);
        if (res.data.code == 200) {
          notify("br", 2, res.data.message);
          setLoading(false);
        } else {
          notify("br", 4, res.data.message);
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  async function handleCities(c, a) {
    if (a.action == "select-option") {
      try {
        const res = await axios({
          method: "post",
          url: `https://unsicapi.azurewebsites.net/cities`,
          data: { comune: a.option.value },
        });
        console.log(res);
        if (res.data) {
          setUpdate(true);
        }
      } catch (e) {
        console.log(e);
      }
    } else if ((a.action = "remove-value")) {
      try {
        const res = await axios({
          method: "delete",
          url: `https://unsicapi.azurewebsites.net/rmcity/${a.removedValue.value}`,
        });
        if (res.data) {
          setUpdate(true);
        }
      } catch (e) {
        console.log(e);
      }
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
                <h1 className="title">Settings</h1>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <h4>DEFAULT CITIES</h4>
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
                <h4>Upload Contact Files</h4>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Button className="secondry">
                        <Input
                          defaultValue=""
                          placeholder="Select File"
                          type="file"
                          onChange={handleFile}
                        />
                        {fileName ? fileName : "Select File"}
                      </Button>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Button
                        className="btn-fill"
                        color="info"
                        onClick={handleUpload}
                      >
                        Upload
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="8">{isLoading && <LoadingSpinner />}</Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default Settings;
