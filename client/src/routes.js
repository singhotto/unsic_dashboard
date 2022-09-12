import Calender from "views/Calender.js";
import AddUser from "views/AddUser.js";
import Rf from "views/Rf.js";
import Cittadinanza from "views/Cittadinanza.js";
import Passport from "views/Passport.js";
import PakIdentity from "views/Pakidentity.js";
import Settings from "views/Settings.js";
import Accounts from "views/Accounts.js";
//import Whatsapp from "views/Whatsapp.js";

var routes = [
  {
    path: "/add-user",
    name: "AddUser",
    rtlName: "الرموز",
    icon: "fa-solid fa-people-group",
    component: AddUser,
    layout: "/admin",
  },
  {
    path: "/rf",
    name: "Ricongiungimento Familiare",
    rtlName: "الرموز",
    icon: "fa-solid fa-person-circle-plus",
    component: Rf,
    layout: "/admin",
  },
  {
    path: "/cittadinanza",
    name: "Cittadinanza",
    rtlName: "الرموز",
    icon: "fa-solid fa-font-awesome",
    component: Cittadinanza,
    layout: "/admin",
  },
  {
    path: "/passport",
    name: "Passaporto Pakistan",
    rtlName: "الرموز",
    icon: "fa-solid fa-passport",
    component: Passport,
    layout: "/admin",
  },
  {
    path: "/pak-identity",
    name: "Pak Identity",
    rtlName: "الرموز",
    icon: "fa-solid fa-address-card",
    component: PakIdentity,
    layout: "/admin",
  },
  {
    path: "/accounts",
    name: "Accounts",
    rtlName: "الرموز",
    icon: "tim-icons icon-lock-circle",
    component: Accounts,
    layout: "/admin",
  },
  // {
  //   path: "/whatsapp",
  //   name: "Whatsapp",
  //   icon: "fa-brands fa-whatsapp",
  //   component: Whatsapp,
  //   layout: "/admin",
  // },
  {
    path: "/calender",
    name: "Calender",
    icon: "tim-icons icon-time-alarm",
    component: Calender,
    layout: "/admin",
  },
  {
    path: "/settings",
    name: "Settings",
    rtlName: "إخطارات",
    icon: "tim-icons icon-settings-gear-63",
    component: Settings,
    layout: "/admin",
  },
];
export default routes;
