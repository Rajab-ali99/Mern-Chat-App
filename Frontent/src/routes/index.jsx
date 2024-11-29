import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Messages from "../components/Messages";
import Authlayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";
const router = createBrowserRouter([
{
    path:"/",
    element: <App/>,
    children:[
        {
            path:"email",
            element: <Authlayouts><CheckEmail/></Authlayouts>
        },
        {
            path:"password",
            element:<Authlayouts><CheckPassword/></Authlayouts>
        },
        {
            path:"register",
            element:<Authlayouts><Register/></Authlayouts>
        },
        {
            path:"forgot-password",
            element:<Authlayouts><ForgotPassword/></Authlayouts>

        },
        {
            path:"",
            element:<Home/>,
            children:[
                {
                    path: ":userId",
                    element: <Messages/>
                }
            ]
        }
    ]

}
])
export default router
  