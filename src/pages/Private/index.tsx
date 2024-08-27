import { useApp } from "../../hooks/useApp";
import Main from "../../layout";
import Login from "../Login/Login";


const Private = () => {
  const { loggedIn } = useApp();
  return loggedIn ? <Main /> : <Login />;

};

export default Private;
