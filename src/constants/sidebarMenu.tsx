// react
import type { JSX } from 'react';

// mui icons
import {
  DashboardOutlined,
  PeopleOutlined,
  WorkOutline,
  AttachMoney,
  SettingsOutlined,
  PhoneIphone,
  CardGiftcardOutlined,
  LocalOfferOutlined,
  HelpOutline,
  MarkunreadOutlined,
  Storefront,
  Inventory2Outlined,
  ReceiptLongOutlined,
  CreditCardOutlined,
  AssignmentTurnedInOutlined,
  SlideshowOutlined,
  BadgeOutlined,
  AdminPanelSettingsOutlined,
  SystemUpdateAltOutlined,
  InfoOutlined,
  FormatListBulletedOutlined,
  ScatterPlotOutlined,
} from '@mui/icons-material';

export interface MenuItem {
  textKey: string;
  icon: JSX.Element;
  path: string;
  role?: 'admin' | 'vendor';
}

export const sidebarMenu: MenuItem[] = [
  // Core Navigation
  { textKey: 'Dashboard', icon: <DashboardOutlined fontSize="small" />, path: '/' },
  { textKey: 'Admins', icon: <AdminPanelSettingsOutlined fontSize="small" />, path: '/admins', role: "admin" },
  { textKey: 'Vendors', icon: <WorkOutline fontSize="small" />, path: '/vendors', role: "admin" },
  { textKey: 'Users', icon: <PeopleOutlined fontSize="small" />, path: '/users', role: "admin" },
  { textKey: 'Roles', icon: <BadgeOutlined fontSize="small" />, path: '/roles', role: "admin" },

  // Commerce
  { textKey: 'Classifications', icon: <FormatListBulletedOutlined fontSize="small" />, path: '/classifications', role: "admin" },
  { textKey: 'Stores', icon: <Storefront fontSize="small" />, path: '/stores' },
  { textKey: 'Categories', icon: <ScatterPlotOutlined fontSize="small" />, path: '/categories'},
  { textKey: 'Products', icon: <Inventory2Outlined fontSize="small" />, path: '/products' },
  // { textKey: 'orders', icon: <ReceiptLongOutlined fontSize="small" />, path: '/orders' },

  // Payments
  // { textKey: 'payment methods', icon: <CreditCardOutlined fontSize="small" />, path: '/payment-methods', role: "admin" },
  // { textKey: 'currencies', icon: <AttachMoney fontSize="small" />, path: '/currencies', role: "admin" },
  // { textKey: 'recharge balances', icon: <PhoneIphone fontSize="small" />, path: '/mobile-recharge', role: "admin" },

  // Promotions & Marketing
  // { textKey: 'coupons', icon: <LocalOfferOutlined fontSize="small" />, path: '/coupons' },
  // { textKey: 'gift cards', icon: <CardGiftcardOutlined fontSize="small" />, path: '/gift-cards', role: "admin" },
  // { textKey: 'gift card requests', icon: <AssignmentTurnedInOutlined fontSize="small" />, path: '/gift-card-requests', role: "admin" },
  { textKey: 'Slider', icon: <SlideshowOutlined fontSize="small" />, path: '/slider', role: "admin" },
  // { textKey: 'popular topics', icon: <HelpOutline fontSize="small" />, path: '/popular-topics', role: "admin" },

  // Communication
  // { textKey: 'messages', icon: <MarkunreadOutlined fontSize="small" />, path: '/messages', role: "admin" },

  // System & Settings
  // { textKey: 'system information', icon: <InfoOutlined fontSize="small" />, path: '/system-information', role: "admin" },
  // { textKey: 'settings', icon: <SettingsOutlined fontSize="small" />, path: '/settings', role: "admin" },
  // { textKey: 'app versions', icon: <SystemUpdateAltOutlined fontSize="small" />, path: '/versions', role: "admin" },
];

export const useFilteredSidebarMenu = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin");
  const myPermissionsString = localStorage.getItem("my_permissions");

  if (!token) return [];

  const userRole = isAdmin === "true" ? "admin" : "vendor";
let myPermissions = {};
if (myPermissionsString) {
  try {
    myPermissions = JSON.parse(myPermissionsString);
  } catch {
    myPermissions = {};
  }
}
  return sidebarMenu.filter((item) => {
    // Role-based filter
    if (item.role && item.role !== userRole) return false;

    // Permission-based filter (match sidebar key with permission)
    // default to true if permission is undefined
    if (userRole === "admin" && ((!myPermissions[item.textKey] && item.textKey!="Dashboard") || myPermissions[item.textKey] === false)) return false;

    return true;
  });
};

