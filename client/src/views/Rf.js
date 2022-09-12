import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactNotificationAlert from "react-notification-alert";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";

async function getClients(
  queryCf = "",
  queryName = "",
  querySurname = "",
  limit = 0
) {
  const res = await axios
    .get(
      `https://unsicapi.azurewebsites.net/rf?cf=${queryCf}&nome=${queryName}&cognome=${querySurname}&limit=${limit}`
    )
    .then((data) => {
      if (data.data.length == 0) {
        return 0;
      } else {
        return data.data.map((x) => {
          return {
            cf: x.cf,
            name: x.nome,
            surname: x.cognome,
            pass: x.PassSpid,
            started: x.dataRic,
            country: x.nazione,
            city: x.comune,
            email: x.spid,
            tel: x.telefono,
          };
        });
      }
    })
    .catch((e) => console.log(e));
  return res;
}
function Rf() {
  const notificationAlertRef = React.useRef(null);
  const [queryCf, setQueryCf] = useState("");
  const [queryName, setQueryName] = useState("");
  const [querySurname, setQuerySurname] = useState("");
  const [Data, setData] = useState([]);
  const [limit, setLimit] = useState(0);
  const [clients, setClients] = useState(0);

  //FIRST RENDER
  useEffect(() => {
    const fatchClient = async () => {
      const res = await getClients(queryCf, queryName, querySurname, limit);
      if (res == 0) {
        notify("br", 3, "No more Clients");
      } else {
        setData(res);
      }
    };
    async function nClients() {
      const res = await axios
        .get(`https://unsicapi.azurewebsites.net/nrf`)
        .then(({ data }) => {
          if (data == null) {
            notify("br", 4, "ERROR");
          } else {
            setClients(data);
          }
        })
        .catch((e) => console.log(e));
    }
    nClients();
    fatchClient();
  }, [limit]);


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

  async function searchClient(e) {
    if (e.key === "Enter") {
      setLimit(0);
    }
  }
  async function handlePrevious() {
    if (limit >= 10) {
      setLimit(limit - 10);
    } else {
      notify("br", 1, "You are first page!!!");
    }
  }
  function handleNext() {
    if (limit < clients) {
      setLimit(limit + 10);
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
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>Codice Fiscale</label>
                        <Input
                          defaultValue=""
                          placeholder="Codice Fiscale"
                          type="text"
                          onKeyPress={searchClient}
                          onChange={(e) => setQueryCf(e.target.value)}
                        />
                      </FormGroup>
                    </Col>

                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue=""
                          placeholder="Name"
                          type="text"
                          onKeyPress={searchClient}
                          onChange={(e) => setQueryName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue=""
                          placeholder="Last Name"
                          type="text"
                          onKeyPress={searchClient}
                          onChange={(e) => setQuerySurname(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <Button
                          className="btn-fill"
                          color="primary"
                          onClick={handlePrevious}
                        >
                          Previous
                        </Button>
                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <Button
                          className="btn-fill"
                          color="primary"
                          onClick={handleNext}
                          disabled={limit + 10 > clients}
                        >
                          Next
                        </Button>
                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <h3>
                          PAGE: {limit / 10}/{Math.ceil(clients / 10)}
                        </h3>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead className="text-primary">
                    <tr>
                      <th>Codice Fiscale</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Started on</th>
                      <th>Number</th>
                    </tr>
                  </thead>
                  <tbody class="rt-tbody" role="rowgroup">
                    {Data.map((d, i) => (
                      <tr
                        class={`rt-tr  -${i % 2 == 0 ? "odd" : "even"}`}
                        role="row"
                        key={i}
                        style={{ cursor: "pointer" }}
                      >
                        <td role="cell" class="rt-td">
                          {d.cf}
                        </td>
                        <td role="cell" class="rt-td">
                          {d.name}
                        </td>
                        <td role="cell" class="rt-td">
                          {d.surname}
                        </td>
                        <td role="cell" class="rt-td">
                          {d.email}
                        </td>
                        <td role="cell" class="rt-td">
                          {d.pass}
                        </td>
                        <td role="cell" class="rt-td">
                          {d.started}
                        </td>
                        <td role="cell" class="rt-td">
                          {d.tel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Rf;
