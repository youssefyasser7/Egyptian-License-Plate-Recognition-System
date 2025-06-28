import "./sidebar.css";
import { Home, Person, DirectionsCar, GroupAdd, Block, History, Lock } from "@mui/icons-material"; // إضافة أيقونة القفل
import { Link } from "react-router-dom";

export default function Sidebar() {
  const userType = localStorage.getItem("userType"); // نتأكد إذا كان المستخدم Admin

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Home className="sidebarIcon" />
            <Link to="/home" className="sidebarListItemText">Home</Link>
          </li>
          <li className="sidebarListItem">
            <Person className="sidebarIcon" />
            <Link to="/users" className="sidebarListItemText">Users</Link>
          </li>
          <li className="sidebarListItem">
            <DirectionsCar className="sidebarIcon" />
            <Link to="/cars" className="sidebarListItemText">Cars</Link>
          </li>
          <li className="sidebarListItem">
            <GroupAdd className="sidebarIcoشn" />
            <Link to="/guests" className="sidebarListItemText">Guests</Link>
          </li>
          <li className="sidebarListItem">
            <Block className="sidebarIcon" />
            <Link to="/blacklist" className="sidebarListItemText">Blacklist</Link>
          </li>
          <li className="sidebarListItem">
            <History className="sidebarIcon" />
            <Link to="/logs" className="sidebarListItemText">Logs</Link>
          </li>

          {/* إضافة رابط تغيير كلمة المرور فقط للمستخدمين من نوع Admin */}
          {userType === "admin" && (
            <li className="sidebarListItem">
              <Lock className="sidebarIcon" />
              <Link to="/change-password" className="sidebarListItemText">Change Password</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
