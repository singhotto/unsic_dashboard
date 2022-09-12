import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactNotificationAlert from "react-notification-alert";
import { CustomInput } from "reactstrap";

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
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function Accounts() {
  const notificationAlertRef = React.useRef(null);
  const [id, setId] = useState("");
  const [account, setAccount] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [modal, setModal] = useState(false);
  const [editAccount, setEditAccount] = useState("");
  const [editUser, setEditUser] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [update, setUpdate] = useState(false);

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

  useEffect(() => {
    setUpdate(false);
    const fatchClient = async () => {
      const res = await axios
        .get(`https://unsicapi.azurewebsites.net/account`)
        .then((data) => {
          if (data.data.length == 0) {
            notify("br", 3, "No Account Yet");
          } else {
            setAccounts(
              data.data.map((x) => {
                return {
                  id: x._id,
                  account: x.account,
                  user: x.user,
                  password: x.password,
                };
              })
            );
          }
        })
        .catch((e) => console.log(e));
    };
    fatchClient();
  }, [update]);

  async function handleAdd(e) {
    try {
      const res = await axios({
        method: "post",
        url: `https://unsicapi.azurewebsites.net/account`,
        data: {
          id,
          account,
          user,
          password,
        },
      });
      if (res.data.duplicate) {
        notify("br", 3, "Account already exists!!!");
      }else if(res.data){
        setUpdate(true);
        notify("br", 2, "Account Added Sucessfully!!!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEdit(id) {
    try {
      setModal(true);
      const res = await axios
        .get(`https://unsicapi.azurewebsites.net/account/${id}`)
        .then((data) => {
          console.log(data);
          if (data.data.length == 0) {
            notify("br", 3, "Error editing");
          } else {
            setId(data.data._id);
            setEditAccount(data.data.account);
            setEditUser(data.data.user);
            setEditPassword(data.data.password);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await axios({
        method: "delete",
        url: `https://unsicapi.azurewebsites.net/rmac/${id}`
      });
      if (res.data) {
        setUpdate(true);
        notify("br", 2, "Account Deleted Successfully!!!");
      }
    } catch (error) {
      console.log(error);
      notify("br", 3, "Account Update Error");
    }
  }

  async function updateAccount() {
    try {
      const res = await axios({
        method: "put",
        url: `https://unsicapi.azurewebsites.net/accountUpdate`,
        data: {
          id,
          account: editAccount,
          user: editUser,
          password: editPassword,
        },
      });
      if (res.data) {
        setModal(!modal);
        setUpdate(true);
        notify("br", 2, "Account Updated Successfully!!!");
      }
    } catch (error) {
      console.log(error);
      notify("br", 3, "Account Update Error");
    }
  }

  function confirmDelete(){
    notify("br", 3, "DOUBLE CLICK TO DELETE ACCOUNT!!!");
  }

  return (
    <>
      <div className="content">
        <div className="react-notification-alert-container">
          <ReactNotificationAlert ref={notificationAlertRef} />
        </div>
        <Modal isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>
            Edit Account
          </ModalHeader>
          <ModalBody>
            <div className="content">
              <FormGroup>
                <label>Account</label>
                <CustomInput
                  defaultValue=""
                  color="black"
                  placeholder="Account"
                  type="text"
                  className="mb-3"
                  style={{ width: "100%" }}
                  value={editAccount}
                  onChange={(e) => setEditAccount(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label>Username</label>
                <CustomInput
                  defaultValue=""
                  color="black"
                  placeholder="user"
                  type="text"
                  className="mb-3"
                  style={{ width: "100%" }}
                  value={editUser}
                  onChange={(e) => setEditUser(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <label>Password</label>
                <CustomInput
                  defaultValue=""
                  color="black"
                  placeholder="Password"
                  type="text"
                  className="mb-3"
                  style={{ width: "100%" }}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </FormGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={updateAccount}>
              Save
            </Button>
            <Button color="secondary" onClick={() => setModal(!modal)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>ADD ACCOUNTS</CardHeader>
              <CardBody>
                <Row>
                  <Col className="pr-md-1" md="3">
                    <FormGroup>
                      <label>Account</label>
                      <Input
                        defaultValue=""
                        placeholder="Account"
                        type="text"
                        bsSize="lg"
                        className="mb-3"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pr-md-1" md="3">
                    <FormGroup>
                      <label>Username / Email</label>
                      <Input
                        defaultValue=""
                        placeholder="Username"
                        type="text"
                        bsSize="lg"
                        className="mb-3"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pr-md-1" md="3">
                    <FormGroup>
                      <label>Password</label>
                      <Input
                        defaultValue=""
                        placeholder="Password"
                        type="text"
                        bsSize="lg"
                        className="mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pr-md-1" md="3">
                    <FormGroup>
                      <br></br>
                      <Button
                        onClick={handleAdd}
                        size="lg"
                        className="btn-fill"
                        color="success"
                      >
                        SAVE
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>ACCOUNTS</CardHeader>
              <CardBody>
                <Table hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Account</th>
                      <th>Username/Email</th>
                      <th>Password</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, i) => (
                      <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{account.account}</td>
                        <td>{account.user}</td>
                        <td>{account.password}</td>
                        <td>
                          <Button
                            className="btn-fill"
                            color="info"
                            onClick={() => handleEdit(account.id)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn-fill"
                            color="danger"
                            onDoubleClick ={() => handleDelete(account.id)}
                            onClick={confirmDelete}
                          >
                            Delete
                          </Button>
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

export default Accounts;
