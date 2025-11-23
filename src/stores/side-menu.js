import { atom } from "recoil";

const sideMenu = atom({
  key: "sideMenu",
  default: {
    menu: [
      // {
      //   icon: "Home",
      //   title: "Dashboard",
      //   pathname: "/",
      //   // subMenu: [
      //   //   {
      //   //     icon: "",
      //   //     pathname: "/",
      //   //     title: "Overview 1",
      //   //   },
      //   //   {
      //   //     icon: "",
      //   //     pathname: "/dashboard-overview-2",
      //   //     title: "Overview 2",
      //   //   },
      //   //   {
      //   //     icon: "",
      //   //     pathname: "/dashboard-overview-3",
      //   //     title: "Overview 3",
      //   //   },
      //   //   {
      //   //     icon: "",
      //   //     pathname: "/dashboard-overview-4",
      //   //     title: "Overview 4",
      //   //   },
      //   // ],
      // },
      // {
      //   icon: "Box",
      //   title: "Menu Layout",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/",
      //       title: "Side Menu",
      //       ignore: true,
      //     },
      //     {
      //       icon: "",
      //       pathname: "/simple-menu/dashboard-overview-1",
      //       title: "Simple Menu",
      //       ignore: true,
      //     },
      //     {
      //       icon: "",
      //       pathname: "/top-menu/dashboard-overview-1",
      //       title: "Top Menu",
      //       ignore: true,
      //     },
      //   ],
      // },
      // {
      //   icon: "ShoppingBag",
      //   title: "E-Commerce",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/categories",
      //       title: "Categories",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/add-product",
      //       title: "Add Product",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/products",
      //       title: "Products",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/product-list",
      //           title: "Product List",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/product-grid",
      //           title: "Product Grid",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       pathname: "/transactions",
      //       title: "Transactions",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/transaction-list",
      //           title: "Transaction List",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/transaction-detail",
      //           title: "Transaction Detail",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       pathname: "/sellers",
      //       title: "Sellers",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/seller-list",
      //           title: "Seller List",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/seller-detail",
      //           title: "Seller Detail",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       pathname: "/reviews",
      //       title: "Reviews",
      //     },
      //   ],
      // },
      // {
      //   icon: "Box",
      //   pathname: "/dashboard",
      //   title: "Dashboard",
      // },
      // {
      //   icon: "BarChart2",
      //   title: "Analytics",
      //   subMenu: [
      //     {
      //       icon: "Box",
      //       pathname: "/dashboard",
      //       title: "Dashboard",
      //     },
      //     {
      //       icon: "Info",
      //       pathname: "/user-analytics",
      //       title: "User Analytics",
      //     },
      //     {
      //       icon: "Info",
      //       pathname: "/user-activity-tracking",
      //       title: "User Activity Tracking",
      //     },
      //     {
      //       icon: "Info",
      //       pathname: "/top-50-items",
      //       title: "Top grocery manual addition",
      //     },
      //     {
      //       icon: "Type",
      //       pathname: "/recipe-analytics",
      //       title: "Recipe Analytics",
      //     },
      //     {
      //       icon: "Type",
      //       pathname: "/meal-analytics",
      //       title: "Meal Plan Analytics",
      //     },
      //     // {
      //     //   icon: "HelpCircle",
      //     //   pathname: "/contact-queries",
      //     //   title: "Contact queries",
      //     // },
      //     // {
      //     //   icon: "HelpCircle",
      //     //   pathname: "/recipes-ideas",
      //     //   title: "Recipes ideas",
      //     // },
      //   ],
      // },
      // {
      //   icon: "ShoppingBag",
      //   pathname: "/Ingredients",
      //   title: "Ingredients",
      // },
      // {
      //   icon: "Trello",
      //   pathname: "/recipes",
      //   title: "Recipes",
      // },
      // {
      //   icon: "Command",
      //   title: "Recipe Options",
      //   subMenu: [
      //     {
      //       icon: "Box",
      //       pathname: "/meal-style-option",
      //       title: "Meal style",
      //     },
      //     {
      //       icon: "Box",
      //       pathname: "/category-option",
      //       title: "Category",
      //     },
      //     {
      //       icon: "Proteins Type",
      //       pathname: "/protein-type-option",
      //       title: "Protein style",
      //     },
      //     {
      //       icon: "Box",
      //       pathname: "/dietary-restriction",
      //       title: "Dietary restriction",
      //     },
      //     {
      //       icon: "Box",
      //       pathname: "/preparation-type",
      //       title: "Preparation",
      //     },

      //   ],
      // },
      // {
      //   icon: "Inbox",
      //   pathname: "/meal-plan",
      //   title: "Meal plans",
      // },
      {
        icon: "Box",
        pathname: "/dashboard",
        title: "Dashboard",
      },
      {
        icon: "Box",
        pathname: "/jobs",
        title: "Jobs",
      },
      {
        icon: "Users",
        pathname: "/users",
        title: "Users",
      },
      {
        icon: "Users",
        pathname: "/couriers",
        title: "Couriers",
      },
      {
        icon: "Trello",
        pathname: "/items",
        title: "Manage Items",
      },
      // {
      //   icon: "Users",
      //   pathname: "/templates",
      //   title: "Templates",
      // },
      // {
      //   icon: "Percent",
      //   pathname: "/reviews",
      //   title: "Reviews",
      // },

      {
        icon: "Twitch",
        pathname: "/reviews",
        title: "Reviews",
      },
      {
        icon: "Watch",
        pathname: "/time-slots",
        title: "Time Slots",
      },
      {
        icon: "CreditCard",
        pathname: "/courier-payments",
        title: "Manage Payouts",
      },
      {
        icon: "Hexagon",
        pathname: "/blogs",
        title: "Blogs",
      },

      // {
      //   icon: "Link",
      //   pathname: "/socialLinks",
      //   title: "Social links",
      // },
      // {
      //   icon: "CreditCard",
      //   pathname: "/plans",
      //   title: "Pricing plans",
      // },
      // {
      //   icon: "MoreHorizontal",
      //   title: "Dropdowns",
      //   subMenu: [
      //     {
      //       icon: "Scissors",
      //       pathname: "/cancellation-reason",
      //       title: "Cancellation reasons",
      //     },
      //     {
      //       icon: "CreditCard",
      //       pathname: "/hear-about-us",
      //       title: "Heard about us",
      //     },
      //     {
      //       icon: "CreditCard",
      //       pathname: "/looking-for",
      //       title: "Looking for",
      //     },
      //   ],
      // },

      // {
      //   icon: "MoreHorizontal",
      //   title: "Static Pages",
      //   subMenu: [
         
         
      //   ],
      // },
      {
        icon: "Edit3",
        pathname: "/change-password",
        title: "Change Password",
      },
      {
        icon: "Settings",
        // pathname: "/website-settings",
        title: "Website Settings",
        subMenu: [
          {
            icon: "Settings",
            pathname: "/website-settings",
            title: "Settings",
          },
          {
            icon: "Twitch",
            pathname: "/testimonials",
            title: "Testimonials",
          },
           {
            icon: "FileText",
            pathname: "/faq",
            title: "FAQ",
          },
          {
            icon: "Type",
            pathname: "/terms-condition",
            title: "Terms & Condition",
          },
          {
            icon: "Info",
            pathname: "/privacy-policy",
            title: "Privacy Policy",
          },
          // {
          //   icon: "Type",
          //   pathname: "/terms-condition",
          //   title: "Terms & Condition",
          // },
        ],
      },
      // {
      //   icon: "CreditCard",
      //   title: "Banners",
      //   subMenu: [
      //     {
      //       icon: "CreditCard",
      //       pathname: "/referral-banner",
      //       title: "Referral Banner",
      //     },
      //     {
      //       icon: "CreditCard",
      //       pathname: "/landing-banner",
      //       title: "Landing Banner",
      //     },
      //     {
      //       icon: "CreditCard",
      //       pathname: "/success-banner",
      //       title: "Success Referral Banner",
      //     },
      //   ],
      // },
      // {
      //   icon: "MoreHorizontal",
      //   title: "Landing Page",
      //   subMenu: [
      //     {
      //       icon: "HelpCircle",
      //       pathname: "/landing-page/category",
      //       title: "Top Category Section",
      //     },
      //     {
      //       icon: "Type",
      //       pathname: "/landing-page",
      //       title: "Header and Banner",
      //     },
      //   ],
      // },

      // {
      //   icon: "MessageSquare",
      //   pathname: "/email-templates",
      //   title: "Email Templates",
      // },
      // {
      //   icon: "Mail",
      //   pathname: "/sms-templates",
      //   title: "SMS Templates",
      // },
      // {
      //   icon: "CreditCard",
      //   pathname: "/newsletter-management",
      //   title: "Newsletter Management",
      // },
      // {
      //   icon: "Server",
      //   pathname: "/unpaid-payment-management",
      //   title: "Unpaid Payment Management",
      // },
      // {
      //   icon: "FileText",
      //   pathname: "/manage-promotion",
      //   title: "Manage Promotion (SMS)",
      // },
      // {
      //   icon: "Calendar",
      //   pathname: "/meal-plan-restrictions",
      //   title: "Meal Plan Restrictions",
      // },
      // {
      //   icon: "HelpCircle",
      //   pathname: "/modify-tooltips",
      //   title: "Modify Tooltips",
      // },
      // "devider",
      // {
      //   icon: "Edit",
      //   title: "Crud",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/crud-data-list",
      //       title: "Data List",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/crud-form",
      //       title: "Form",
      //     },
      //   ],
      // },
      // {
      //   icon: "Users",
      //   title: "Users",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/users-layout-1",
      //       title: "Layout 1",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/users-layout-2",
      //       title: "Layout 2",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/users-layout-3",
      //       title: "Layout 3",
      //     },
      //   ],
      // },
      // {
      //   icon: "Trello",
      //   title: "Profile",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/profile-overview-1",
      //       title: "Overview 1",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/profile-overview-2",
      //       title: "Overview 2",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/profile-overview-3",
      //       title: "Overview 3",
      //     },
      //   ],
      // },
      // {
      //   icon: "Layout",
      //   title: "Pages",
      //   subMenu: [
      //     {
      //       icon: "",
      //       title: "Wizards",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/wizard-layout-1",
      //           title: "Layout 1",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/wizard-layout-2",
      //           title: "Layout 2",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/wizard-layout-3",
      //           title: "Layout 3",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       title: "Blog",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/blog-layout-1",
      //           title: "Layout 1",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/blog-layout-2",
      //           title: "Layout 2",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/blog-layout-3",
      //           title: "Layout 3",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       title: "Pricing",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/pricing-layout-1",
      //           title: "Layout 1",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/pricing-layout-2",
      //           title: "Layout 2",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       title: "Invoice",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/invoice-layout-1",
      //           title: "Layout 1",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/invoice-layout-2",
      //           title: "Layout 2",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       title: "FAQ",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/faq-layout-1",
      //           title: "Layout 1",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/faq-layout-2",
      //           title: "Layout 2",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/faq-layout-3",
      //           title: "Layout 3",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       pathname: "login",
      //       title: "Login",
      //     },
      //     {
      //       icon: "",
      //       pathname: "register",
      //       title: "Register",
      //     },
      //     {
      //       icon: "",
      //       pathname: "error-page",
      //       title: "Error Page",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/update-profile",
      //       title: "Update profile",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/change-password",
      //       title: "Change Password",
      //     },
      //   ],
      // },
      // "devider",
      // {
      //   icon: "Inbox",
      //   title: "Components",
      //   subMenu: [
      //     {
      //       icon: "",
      //       title: "Table",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/regular-table",
      //           title: "Regular Table",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/tabulator",
      //           title: "Tabulator",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       title: "Overlay",
      //       subMenu: [
      //         {
      //           icon: "",
      //           pathname: "/modal",
      //           title: "Modal",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/slide-over",
      //           title: "Slide Over",
      //         },
      //         {
      //           icon: "",
      //           pathname: "/notification",
      //           title: "Notification",
      //         },
      //       ],
      //     },
      //     {
      //       icon: "",
      //       pathname: "/tab",
      //       title: "Tab",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/accordion",
      //       title: "Accordion",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/button",
      //       title: "Button",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/alert",
      //       title: "Alert",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/progress-bar",
      //       title: "Progress Bar",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/tooltip",
      //       title: "Tooltip",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/dropdown",
      //       title: "Dropdown",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/typography",
      //       title: "Typography",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/icon",
      //       title: "Icon",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/loading-icon",
      //       title: "Loading Icon",
      //     },
      //   ],
      // },
      // {
      //   icon: "Sidebar",
      //   title: "Forms",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/regular-form",
      //       title: "Regular Form",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/datepicker",
      //       title: "Datepicker",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/tom-select",
      //       title: "Tom Select",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/file-upload",
      //       title: "File Upload",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/wysiwyg-editor",
      //       title: "Wysiwyg Editor",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/validation",
      //       title: "Validation",
      //     },
      //   ],
      // },
      // {
      //   icon: "HardDrive",
      //   title: "Widgets",
      //   subMenu: [
      //     {
      //       icon: "",
      //       pathname: "/chart",
      //       title: "Chart",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/slider",
      //       title: "Slider",
      //     },
      //     {
      //       icon: "",
      //       pathname: "/image-zoom",
      //       title: "Image Zoom",
      //     },
      //   ],
      // },
    ],
  },
});

export { sideMenu };
