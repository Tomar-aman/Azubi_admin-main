import { SVG } from "../icon";
export interface SidebarMenu {
  id: number;
  icon?: React.ElementType | any;
  label: string;
  url?: string;
  key?: string;

  children?: {
    id: number;
    label: string;
    url?: string;
  }[];
}
export const MENU_DATA: SidebarMenu[] = [
  {
    id: 1,
    icon: SVG.DashboardIcon,
    label: "Dashboard",
    url: "/dashboard",
    key: "dashboard",
  },
  {
    id: 2,
    icon: SVG.GroupUser,
    label: "Manage Employers",
    url: "/manage-employers",
    key: "manage-employers",
  },
  {
    id: 3,
    icon: SVG.JobsIcon,
    label: "Manage Jobs",
    url: "/manage-jobs",
    key: "manage-jobs",
  },
  {
    id: 4,
    icon: SVG.Industries,
    label: "Manage Industries",
    url: "/manage-industries",
    key: "manage-industries",
  },
  {
    id: 5,
    icon: SVG.Industries,
    label: "Job Types",
    url: "/manage-type-of-job",
    key: "manage-type-of-job",
  },
  {
    id: 6,
    icon: SVG.CitiesIcon,
    label: "Manage Regions",
    url: "/manage-regions",
    key: "manage-regions",
  },
  {
    id: 7,
    icon: SVG.CitiesIcon,
    label: "Manage Cities",
    url: "/manage-cities",
    key: "manage-cities",
  },
  {
    id: 8,
    icon: SVG.ContentIcon,
    label: "Manage Content",
    key: "manage-content",
    children: [
      {
        id: 1,
        label: "Terms & Conditions",
        url: "terms-and-conditions",
      },
      {
        id: 2,
        label: "Manage Training",
        url: "training",
      },
      {
        id: 3,
        label: "Manage Beginning",
        url: "beginning",
      },
      {
        id: 4,
        label: "Manage Federal State",
        url: "Federal-State",
      },
      {
        id: 5,
        label: "Privacy Policy",
        url: "privacy-policy",
      },
      {
        id: 6,
        label: "Job Cover Letter",
        url: "job-cover-letter",
      },
      {
        id: 7,
        label: "Appointment Letter",
        url: "appointment",
      },
      {
        id: 8,
        label: "Landing Page",
        url: "landing-page",
      },
      {
        id: 9,
        label: "job-alert",
        url: "job-alert",
      },
      {
        id: 10,
        label: "Home Page",
        url: "home-page",
      },
      {
        id: 11,
        label: "Job Market",
        url: "job-market",
      },
      {
        id: 12,
        label: "Apply Form",
        url: "apply-form",
      },
      {
        id: 13,
        label: "Company Content",
        url: "company-content",
      },
      {
        id: 14,
        label: "side bar content",
        url: "side-bar-content",
      },
      {
        id: 15,
        label: "FAQ Content",
        url: "faq-content",
      },
      {
        id: 16,
        label: "About us",
        url: "about-us",
      },
      {
        id: 17,
        label: "Magazine order",
        url: "magazine-order",
      },
      {
        id: 18,
        label: "Magazine Contact",
        url: "magazine-contact",
      },
      {
        id: 19,
        label: "Contact us",
        url: "contact-us",
      },
      {
        id: 20,
        label: "Contact Model",
        url: "contact-model",
      },
      {
        id: 21,
        label: "Job-wall",
        url: "job-wall",
      },
      {
        id: 22,
        label: "home page (New)",
        url: "home-v2",
      },
      {
        id: 23,
        label: "Email content",
        url: "email-content",
      },
      {
        id: 24,
        label: "Navbar Tabs",
        url: "nav-bar-tab",
      },
      {
        id: 25,
        label: "Manage-Footer",
        url: "manage-footer",
      },
      {
        id: 26,
        label: "Manage-City",
        url: "manage-city-content",
      },
      {
        id: 27,
        label: "Manage-Gallery",
        url: "manage-gallery",
      },
      {
        id: 28,
        label: "Footer-gallery",
        url: "footer-gallery",
      },
      {
        id: 29,
        label: "Landing-Page-gallery",
        url: "landing-page-gallery",
      },
    ],
  },
  {
    id: 9,
    icon: SVG.Setting,
    label: "Manage Banners",
    url: "/add-banner",
    key: "add-banner",
  },
  {
    id: 10,
    icon: SVG.Setting,
    label: "Admin Settings",
    url: "/admin-setting",
    key: "admin-setting",
  },
  {
    id: 11,
    icon: SVG.Setting,
    label: "Contact",
    url: "/contact",
    key: "contact",
  },
  {
    id: 12,
    icon: SVG.Setting,
    label: "ApplicationTip",
    url: "/applicationTip",
    key: "applicationTip",
  },
  {
    id: 14,
    icon: SVG.GroupUser,
    label: "Manage Users",
    url: "/manage-users",
    key: "manage-users",
  },
  {
    id: 15,
    icon: SVG.GroupUser,
    label: "Manage Employees",
    url: "/manage-employees",
    key: "manage-employees",
  },
  {
    id: 13,
    icon: SVG.Logout,
    label: "Log Out",
  },
];
