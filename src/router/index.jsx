import { useRoutes } from "react-router-dom";
import SideMenu from "../layouts/side-menu/Main";
import SimpleMenu from "../layouts/simple-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import DashboardOverview1 from "../views/dashboard-overview-1/Main";
import DashboardOverview2 from "../views/dashboard-overview-2/Main";
import DashboardOverview3 from "../views/dashboard-overview-3/Main";
import DashboardOverview4 from "../views/dashboard-overview-4/Main";
import Categories from "../views/categories/Main";
import AddProduct from "../views/add-product/Main";
import ProductList from "../views/product-list/Main";
import ProductGrid from "../views/product-grid/Main";
import TransactionList from "../views/transaction-list/Main";
import TransactionDetail from "../views/transaction-detail/Main";
import SellerList from "../views/seller-list/Main";
import SellerDetail from "../views/seller-detail/Main";
// import Reviews from "../views/reviews/Main";
import Inbox from "../views/inbox/Main";
import FileManager from "../views/file-manager/Main";
import PointOfSale from "../views/point-of-sale/Main";
import Chat from "../views/chat/Main";
import Post from "../views/post/Main";
import Calendar from "../views/calendar/Main";
import CrudDataList from "../views/crud-data-list/Main";
import CrudForm from "../views/crud-form/Main";
import UsersLayout1 from "../views/users-layout-1/Main";
import UsersLayout2 from "../views/users-layout-2/Main";
import UsersLayout3 from "../views/users-layout-3/Main";
import ProfileOverview1 from "../views/profile-overview-1/Main";
import ProfileOverview2 from "../views/profile-overview-2/Main";
import ProfileOverview3 from "../views/profile-overview-3/Main";
import WizardLayout1 from "../views/wizard-layout-1/Main";
import WizardLayout2 from "../views/wizard-layout-2/Main";
import WizardLayout3 from "../views/wizard-layout-3/Main";
import BlogLayout1 from "../views/blog-layout-1/Main";
import BlogLayout2 from "../views/blog-layout-2/Main";
import BlogLayout3 from "../views/blog-layout-3/Main";
import PricingLayout1 from "../views/pricing-layout-1/Main";
import PricingLayout2 from "../views/pricing-layout-2/Main";
import InvoiceLayout1 from "../views/invoice-layout-1/Main";
import InvoiceLayout2 from "../views/invoice-layout-2/Main";
import FaqLayout1 from "../views/faq-layout-1/Main";
import FaqLayout2 from "../views/faq-layout-2/Main";
import FaqLayout3 from "../views/faq-layout-3/Main";
import Login from "../views/login/Main";
import Register from "../views/register/Main";
import ErrorPage from "../views/error-page/Main";
import Profile from "../views/profile/profile";
import UpdateProfile from "../views/update-profile/Main";
import ChangePassword from "../views/change-password/Main";
import RegularTable from "../views/regular-table/Main";
import Tabulator from "../views/tabulator/Main";
import Modal from "../views/modal/Main";
import SlideOver from "../views/slide-over/Main";
import Notification from "../views/notification/Main";
import Tab from "../views/tab/Main";
import Accordion from "../views/accordion/Main";
import Button from "../views/button/Main";
import Alert from "../views/alert/Main";
import ProgressBar from "../views/progress-bar/Main";
import Tooltip from "../views/tooltip/Main";
import Dropdown from "../views/dropdown/Main";
import Typography from "../views/typography/Main";
import Icon from "../views/icon/Main";
import LoadingIcon from "../views/loading-icon/Main";
import RegularForm from "../views/regular-form/Main";
import Datepicker from "../views/datepicker/Main";
import TomSelect from "../views/tom-select/Main";
import FileUpload from "../views/file-upload/Main";
import WysiwygEditor from "../views/wysiwyg-editor/Main";
import Validation from "../views/validation/Main";
import Chart from "../views/chart/Main";
import Slider from "../views/slider/Main";
import ImageZoom from "../views/image-zoom/Main";
import ProtectedRoute from "./protectedRoutes";
import Settings from "../views/settings/Main";
import WeeklyPlanForm from "../views/post/Main";
import MealPlanDetail from "../views/transaction-detail/meal-plan-detail";
import Ingredients from "../views/product-list/ingredents";
import RecipeConfiguration from "../views/product-list/Main";
import MealPlan from "../views/product-list/meal-plan";
import RecipeSettings from "../views/crud-form/Main";
import AddCoupon from "../views/settings/add-coupon";
import SocialLinks from "../views/product-list/socialLinks";
import AddLinks from "../views/settings/add-links";
import Users from "../views/product-list/users";
import AddUsers from "../views/settings/add-users";
import ADDPLANS from "../views/settings/add-plans";
import Plans from "../views/product-list/plans";
import UserDetail from "../views/transaction-detail/user-detail";
import FAQ from "../components/static-pages/faq";
import TermsCondition from "../components/static-pages/terms&condition";
import PrivacyPolicy from "../components/static-pages/privacy-policy";
import ContactQueries from "../components/static-pages/conatct-queries";
import ReferralBanner from "../components/referral-banner/referral-banner";
import LandingPageCategory from "../views/landing-page/landing-page";
import LandingPage from "../views/landing-page/landingPage";
import EmailTemplates from "../views/email-template-list/emails";
import RecipesIdeas from "../components/static-pages/recipes-ideas";
import Newsletter from "../views/product-list/newsletter";
import Sms from "../views/settings/sms";
import MealPlanRestrictions from "../views/settings/meal-plan-restrictions";
import RecipeAnalytics from "../views/recipe-analytics/recipe-analytics";
import UserAnalytics from "../views/user-analytics/user-analytics";
import MealAnalytics from "../views/meal-analytics/meal-analytics";
import ModifyTooltip from "../views/modify-tooltip/modify-tooltip";
import HowItWorks from "../components/static-pages/how-it-works";
import HowReferralWorks from "../components/static-pages/how-referral-works";
import AboutUs from "../components/static-pages/about-us";
import LandingBanner from "../components/landingBanner/landingBanner";
import CancellationReason from "../views/cancellation-reason/cancellation";
import AddCancellationReason from "../views/cancellation-reason/add-cancellation";
import TopItems from "../views/top-50-items/top-50-items";
import HearAboutUs from "../views/hear-about-us/hear-about-us";
import AddHearAboutUs from "../views/hear-about-us/add-hear-about-us";
import LookingFor from "../views/looking-for/looking-for";
import AddlookingFor from "../views/looking-for/add-looking-for";
import UnPaidManagement from "../views/unpaid-payment/unpaid-payment";
import SMSTemplates from "../views/sms-template/sms-template";
import ManagePromotion from "../views/settings/sms";
import UserActivityTracking from "../views/user-activity-tracking/user-activity-tracking";
import SuccessBanner from "../views/success-banner/success-banner";
import MealStyleOption from "../views/recipe-option/meal-style";
import AddMealStyleDropdown from "../views/recipe-option/add-meal-style";
import CategoryOption from "../views/recipe-option/category";
import AddCategoryDropdown from "../views/recipe-option/add-category";
import AddProteinTypeDropdown from "../views/recipe-option/add-protein-type";
import ProteinTypeOption from "../views/recipe-option/protein-type";
import DietaryRestrictionOption from "../views/recipe-option/dietary-restriction";
import AddDietaryRestrictionDropdown from "../views/recipe-option/add-dietary-restriction";
import PreparationOption from "../views/recipe-option/preparation";
import AddPreparationDropdown from "../views/recipe-option/add-preparation";
import ReviewsTable from "../views/product-list/reviews";
import Artists from "../views/artists";
import AddArtists from "../views/artists/add-artists";
import Questions from "../views/product-list/questions";
import TravelReflections from "../views/product-list/travel-reflections";
import DesignInspirations from "../views/product-list/designInspirations";
import InspiredMoments from "../views/product-list/inspiredMoments";
import DistinctStyle from "../views/product-list/distinctStyle";
import ArtistDetails from "../views/product-list/artist-details";
import ArtistMatched from "../views/product-list/artist-matched";
import VibeMatches from "../views/product-list/vibe-matches";
import Templates from "../views/templates";
import AddTemplates from "../views/templates/add-template";
import Items from "../views/product-list/Items";
import AddItems from "../views/settings/add-items";
import Testimonials from "../views/product-list/Testimonials";
import Reviews from "../views/product-list/reviews";
import Blogs from "../views/product-list/Blogs";
import AddTestimonial from "../views/settings/add-testimonial";
import AddBlog from "../views/settings/add-blog";
import WebsiteSettings from "../views/settings/websiteSettings";
import UserDetails from "../components/user-detail/UserDetails";
import Couriers from "../views/product-list/Couriers";
import AddCouriers from "../views/settings/Add-Couriers";
import CourierDetails from "../components/user-detail/Courier-Details";
import Jobs from "../views/product-list/Jobs";
import JobDetails from "../views/product-list/Job-Details";
import TimeSlots from "../views/product-list/TimeSlots";
import AddTimeSlot from "../views/settings/Add-TimSlots";
import Payments from "../views/product-list/CourierPayments";

function Router() {
  const routes = [
    {
      path: "/",
      element: (
        // <ProtectedRoute>
          <SideMenu />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          // element: <DashboardOverview4 />,
          element: <DashboardOverview1 />,
        },
        {
          path: "/add-ingredients",
          // element: <DashboardOverview4 />,
          element: <Settings />,
        },
        {
          path: "/add-coupon",
          // element: <DashboardOverview4 />,
          element: <AddCoupon />,
        },
        {
          path: "/add-socialLinks",
          // element: <DashboardOverview4 />,
          element: <AddLinks />,
        },
        {
          path: "ingredients",
          element: <Ingredients />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "couriers",
          element: <Couriers />,
        },
        {
          path: "/testimonials",
          element: <Testimonials />,
        },
        {
          path: "/reviews",
          element: <Reviews />,
        },
         {
          path: "/add-testimonial",
          element: <AddTestimonial />,
        },
         {
          path: "/add-timeslots",
          element: <AddTimeSlot />,
        },
         {
          path: "/time-slots",
          element: <TimeSlots />,
        },
        {
          path: "/courier-payments",
          element: <Payments />,
        },
        {
          path: "/items",
          element: <Items />,
        },
        {
          path: "/add-items",
          element: <AddItems />,
        },


        {
          path: "/blogs",
          element: <Blogs />,
        },
        {
          path: "/add-blog",
          element: <AddBlog />,
        },
         {
          path: "/website-settings",
          element: <WebsiteSettings />,
        },
        {
          path: "questions-detail/:userId",
          element: <Questions />,
        },
        {
          path: "artist-matched",
          element: <ArtistMatched />,
        },
        {
          path: "artist-who-get-my-vibe",
          element: <VibeMatches />,
        },
        {
          path: "your-design-inspirations/:userId",
          element: <DesignInspirations />,
        },
        {
          path: "your-travel-reflections/:userId",
          element: <TravelReflections />,
        },
        {
          path: "moments-that-inspire-you/:userId",
          element: <InspiredMoments />,
        },
        {
          path: "owning-your-distinctive-style/:userId",
          element: <DistinctStyle />,
        },
        {
          path: "artists",
          element: <Artists />,
        },
        {
          path: "templates",
          element: <Templates />,
        },
        {
          path: "/user-activity-tracking",
          element: <UserActivityTracking />,
        },
        {
          path: "add-users",
          element: <AddUsers />,
        },
        {
          path: "add-couriers",
          element: <AddCouriers />,
        },
        {
          path: "add-artists",
          element: <AddArtists />,
        },
        {
          path: "add-templates",
          element: <AddTemplates />,
        },
        {
          path: "reviews",
          element: <ReviewsTable />,
        },
        {
          path: "add-recipes",
          element: <RecipeSettings />,
        },
        {
          path: "plans",
          element: <Plans />,
        },
        {
          path: "jobs",
          element: <Jobs />,
        },
        {
          path: "job-details/:id",
          element: <JobDetails />,
        },
        {
          path: "add-plans",
          element: <ADDPLANS />,
        },
        {
          path: "user-detail/:id",
          element: <UserDetails />,
        },
        {
          path: "courier-detail/:id",
          element: <CourierDetails />,
        },
        {
          path: "artist-detail/:id",
          element: <ArtistDetails />,
        },
        {
          path: "faq",
          element: <FAQ />,
        },
        {
          path: "terms-condition",
          element: <TermsCondition />,
        },
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "how-it-works",
          element: <HowItWorks />,
        },
        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "how-referral-works",
          element: <HowReferralWorks />,
        },
        {
          path: "contact-queries",
          element: <ContactQueries />,
        },
        {
          path: "recipes-ideas",
          element: <RecipesIdeas />,
        },
        {
          path: "referral-banner",
          element: <ReferralBanner />,
        },
        {
          path: "landing-banner",
          element: <LandingBanner />,
        },
        {
          path: "success-banner",
          element: <SuccessBanner />,
        },
        {
          path: "landing-page",
          element: <LandingPage />,
        },
        {
          path: "/dashboard",
          element: <DashboardOverview1 />,
        },
        {
          path: "/landing-page/category",
          element: <LandingPageCategory />,
        },
        {
          path: "email-templates",
          element: <EmailTemplates />,
        },
        {
          path: "sms-templates",
          element: <SMSTemplates />,
        },
        {
          path: "newsletter-management",
          element: <Newsletter />,
        },
        {
          path: "unpaid-payment-management",
          element: <UnPaidManagement />,
        },
        {
          path: "manage-promotion",
          element: <ManagePromotion />, 
        },
        {
          path: "recipe-analytics",
          element: <RecipeAnalytics />,
        },
        {
          path: "meal-analytics",
          element: <MealAnalytics />,
        },
        {
          path: "user-analytics",
          element: <UserAnalytics />,
        },

        // {
        //   path: "dashboard-overview-3",
        //   element: <DashboardOverview3 />,
        // },
        {
          path: "meal-plan-restrictions",
          element: <MealPlanRestrictions />,
        },
        {
          path: "top-50-items",
          element: <TopItems />,
        },
        {
          path: "meal-style-option",
          element: <MealStyleOption />,
        },
        {
          path: "add-meal-style-option",
          element: <AddMealStyleDropdown />,
        },
        {
          path: "category-option",
          element: <CategoryOption />,
        },
        {
          path: "add-category-option",
          element: <AddCategoryDropdown />,
        },
        {
          path: "protein-type-option",
          element: <ProteinTypeOption />,
        },
        {
          path: "add-protein-type",
          element: <AddProteinTypeDropdown />,
        },
        {
          path: "dietary-restriction",
          element: <DietaryRestrictionOption />,
        },
        {
          path: "add-dietary-restriction",
          element: <AddDietaryRestrictionDropdown />,
        },
        {
          path: "preparation-type",
          element: <PreparationOption />,
        },
        {
          path: "add-preparation-type",
          element: <AddPreparationDropdown />,
        },
        // {
        //   path: "categories",
        //   element: <Categories />,
        // },
        // {
        //   path: "add-product",
        //   element: <AddProduct />,
        // },
        // {
        //   path: "product-list",
        //   element: <ProductList />,
        // },
        // {
        //   path: "product-grid",
        //   element: <ProductGrid />,
        // },
        // {
        //   path: "transaction-list",
        //   element: <TransactionList />,
        // },
        {
          path: "view-recipe",
          element: <TransactionDetail />,
        },
        {
          path: "meal-plan-detail",
          element: <MealPlanDetail />,
        },
        ,
        // {
        //   path: "seller-list",
        //   element: <SellerList />,
        // },
        // {
        //   path: "seller-detail",
        //   element: <SellerDetail />,
        // },
        // {
        //   path: "reviews",
        //   element: <Reviews />,
        // },

        {
          path: "meal-plan",
          element: <MealPlan />,
        },

        // {
        //   path: "file-manager",
        //   element: <FileManager />,
        // },
        // {
        //   path: "point-of-sale",
        //   element: <PointOfSale />,
        // },
        // {
        //   path: "chat",
        //   element: <Chat />,
        // },
        {
          path: "add-meal-plan/:id?",
          element: <WeeklyPlanForm />,
        },
        // {
        //   path: "calendar",
        //   element: <Calendar />,
        // },
        // {
        //   path: "crud-data-list",
        //   element: <CrudDataList />,
        // },
        {
          path: "recipes",
          element: <RecipeConfiguration />,
        },
        {
          path: "socialLinks",
          element: <SocialLinks />,
        },
        {
          path: "cancellation-reason",
          element: <CancellationReason />,
        },
        {
          path: "hear-about-us",
          element: <HearAboutUs />,
        },
        {
          path: "looking-for",
          element: <LookingFor />,
        },
        {
          path: "add-cancellation-reason",
          element: <AddCancellationReason />,
        },
        {
          path: "add-hear-about-us",
          element: <AddHearAboutUs />,
        },
        {
          path: "add-looking-for",
          element: <AddlookingFor />,
        },
        {
          path: "modify-tooltips",
          element: <ModifyTooltip />,
        },
        // {
        //   path: "users-layout-1",
        //   element: <UsersLayout1 />,
        // },
        // {
        //   path: "users-layout-2",
        //   element: <UsersLayout2 />,
        // },
        // {
        //   path: "users-layout-3",
        //   element: <UsersLayout3 />,
        // },
        // {
        //   path: "profile-overview-1",
        //   element: <ProfileOverview1 />,
        // },
        // {
        //   path: "profile-overview-2",
        //   element: <ProfileOverview2 />,
        // },
        // {
        //   path: "profile-overview-3",
        //   element: <ProfileOverview3 />,
        // },
        // {
        //   path: "wizard-layout-1",
        //   element: <WizardLayout1 />,
        // },
        // {
        //   path: "wizard-layout-2",
        //   element: <WizardLayout2 />,
        // },
        // {
        //   path: "wizard-layout-3",
        //   element: <WizardLayout3 />,
        // },
        // {
        //   path: "blog-layout-1",
        //   element: <BlogLayout1 />,
        // },
        // {
        //   path: "blog-layout-2",
        //   element: <BlogLayout2 />,
        // },
        // {
        //   path: "blog-layout-3",
        //   element: <BlogLayout3 />,
        // },
        // {
        //   path: "pricing-layout-1",
        //   element: <PricingLayout1 />,
        // },
        // {
        //   path: "pricing-layout-2",
        //   element: <PricingLayout2 />,
        // },
        // {
        //   path: "invoice-layout-1",
        //   element: <InvoiceLayout1 />,
        // },
        // {
        //   path: "invoice-layout-2",
        //   element: <InvoiceLayout2 />,
        // },
        // {
        //   path: "faq-layout-1",
        //   element: <FaqLayout1 />,
        // },
        // {
        //   path: "faq-layout-2",
        //   element: <FaqLayout2 />,
        // },
        // {
        //   path: "faq-layout-3",
        //   element: <FaqLayout3 />,
        // },
        // {
        //   path: "update-profile",
        //   element: <UpdateProfile />,
        // },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        // {
        //   path: "regular-table",
        //   element: <RegularTable />,
        // },
        // {
        //   path: "tabulator",
        //   element: <Tabulator />,
        // },
        // {
        //   path: "modal",
        //   element: <Modal />,
        // },
        // {
        //   path: "slide-over",
        //   element: <SlideOver />,
        // },
        // {
        //   path: "notification",
        //   element: <Notification />,
        // },
        // {
        //   path: "tab",
        //   element: <Tab />,
        // },
        // {
        //   path: "accordion",
        //   element: <Accordion />,
        // },
        // {
        //   path: "button",
        //   element: <Button />,
        // },
        // {
        //   path: "alert",
        //   element: <Alert />,
        // },
        // {
        //   path: "progress-bar",
        //   element: <ProgressBar />,
        // },
        // {
        //   path: "tooltip",
        //   element: <Tooltip />,
        // },
        // {
        //   path: "dropdown",
        //   element: <Dropdown />,
        // },
        // {
        //   path: "typography",
        //   element: <Typography />,
        // },
        {
          path: "icon",
          element: <Icon />,
        },
        // {
        //   path: "loading-icon",
        //   element: <LoadingIcon />,
        // },
        // {
        //   path: "regular-form",
        //   element: <RegularForm />,
        // },
        // {
        //   path: "datepicker",
        //   element: <Datepicker />,
        // },
        // {
        //   path: "tom-select",
        //   element: <TomSelect />,
        // },
        // {
        //   path: "file-upload",
        //   element: <FileUpload />,
        // },
        // {
        //   path: "wysiwyg-editor",
        //   element: <WysiwygEditor />,
        // },
        // {
        //   path: "validation",
        //   element: <Validation />,
        // },
        // {
        //   path: "chart",
        //   element: <Chart />,
        // },
        // {
        //   path: "slider",
        //   element: <Slider />,
        // },
        // {
        //   path: "image-zoom",
        //   element: <ImageZoom />,
        // },
      ],
    },
    // {
    //   path: "/simple-menu",
    //   element: <SimpleMenu />,
    //   children: [
    //     {
    //       path: "dashboard-overview-1",
    //       element: <DashboardOverview1 />,
    //     },
    //     {
    //       path: "dashboard-overview-2",
    //       element: <DashboardOverview2 />,
    //     },
    //     {
    //       path: "dashboard-overview-3",
    //       element: <DashboardOverview3 />,
    //     },
    //     {
    //       path: "dashboard-overview-4",
    //       element: <DashboardOverview4 />,
    //     },
    //     {
    //       path: "categories",
    //       element: <Categories />,
    //     },
    //     {
    //       path: "add-product",
    //       element: <AddProduct />,
    //     },
    //     {
    //       path: "product-list",
    //       element: <ProductList />,
    //     },
    //     {
    //       path: "product-grid",
    //       element: <ProductGrid />,
    //     },
    //     {
    //       path: "transaction-list",
    //       element: <TransactionList />,
    //     },
    //     {
    //       path: "transaction-detail",
    //       element: <TransactionDetail />,
    //     },
    //     {
    //       path: "seller-list",
    //       element: <SellerList />,
    //     },
    //     {
    //       path: "seller-detail",
    //       element: <SellerDetail />,
    //     },
    //     {
    //       path: "reviews",
    //       element: <Reviews />,
    //     },
    //     {
    //       path: "inbox",
    //       element: <Inbox />,
    //     },
    //     {
    //       path: "file-manager",
    //       element: <FileManager />,
    //     },
    //     {
    //       path: "point-of-sale",
    //       element: <PointOfSale />,
    //     },
    //     {
    //       path: "chat",
    //       element: <Chat />,
    //     },
    //     {
    //       path: "post",
    //       element: <Post />,
    //     },
    //     {
    //       path: "calendar",
    //       element: <Calendar />,
    //     },
    //     {
    //       path: "crud-data-list",
    //       element: <CrudDataList />,
    //     },
    //     {
    //       path: "crud-form",
    //       element: <CrudForm />,
    //     },
    //     {
    //       path: "users-layout-1",
    //       element: <UsersLayout1 />,
    //     },
    //     {
    //       path: "users-layout-2",
    //       element: <UsersLayout2 />,
    //     },
    //     {
    //       path: "users-layout-3",
    //       element: <UsersLayout3 />,
    //     },
    //     {
    //       path: "profile-overview-1",
    //       element: <ProfileOverview1 />,
    //     },
    //     {
    //       path: "profile-overview-2",
    //       element: <ProfileOverview2 />,
    //     },
    //     {
    //       path: "profile-overview-3",
    //       element: <ProfileOverview3 />,
    //     },
    //     {
    //       path: "wizard-layout-1",
    //       element: <WizardLayout1 />,
    //     },
    //     {
    //       path: "wizard-layout-2",
    //       element: <WizardLayout2 />,
    //     },
    //     {
    //       path: "wizard-layout-3",
    //       element: <WizardLayout3 />,
    //     },
    //     {
    //       path: "blog-layout-1",
    //       element: <BlogLayout1 />,
    //     },
    //     {
    //       path: "blog-layout-2",
    //       element: <BlogLayout2 />,
    //     },
    //     {
    //       path: "blog-layout-3",
    //       element: <BlogLayout3 />,
    //     },
    //     {
    //       path: "pricing-layout-1",
    //       element: <PricingLayout1 />,
    //     },
    //     {
    //       path: "pricing-layout-2",
    //       element: <PricingLayout2 />,
    //     },
    //     {
    //       path: "invoice-layout-1",
    //       element: <InvoiceLayout1 />,
    //     },
    //     {
    //       path: "invoice-layout-2",
    //       element: <InvoiceLayout2 />,
    //     },
    //     {
    //       path: "faq-layout-1",
    //       element: <FaqLayout1 />,
    //     },
    //     {
    //       path: "faq-layout-2",
    //       element: <FaqLayout2 />,
    //     },
    //     {
    //       path: "faq-layout-3",
    //       element: <FaqLayout3 />,
    //     },
    //     {
    //       path: "update-profile",
    //       element: <UpdateProfile />,
    //     },
    //     {
    //       path: "change-password",
    //       element: <ChangePassword />,
    //     },
    //     {
    //       path: "regular-table",
    //       element: <RegularTable />,
    //     },
    //     {
    //       path: "tabulator",
    //       element: <Tabulator />,
    //     },
    //     {
    //       path: "modal",
    //       element: <Modal />,
    //     },
    //     {
    //       path: "slide-over",
    //       element: <SlideOver />,
    //     },
    //     {
    //       path: "notification",
    //       element: <Notification />,
    //     },
    //     {
    //       path: "tab",
    //       element: <Tab />,
    //     },
    //     {
    //       path: "accordion",
    //       element: <Accordion />,
    //     },
    //     {
    //       path: "button",
    //       element: <Button />,
    //     },
    //     {
    //       path: "alert",
    //       element: <Alert />,
    //     },
    //     {
    //       path: "progress-bar",
    //       element: <ProgressBar />,
    //     },
    //     {
    //       path: "tooltip",
    //       element: <Tooltip />,
    //     },
    //     {
    //       path: "dropdown",
    //       element: <Dropdown />,
    //     },
    //     {
    //       path: "typography",
    //       element: <Typography />,
    //     },
    //     {
    //       path: "icon",
    //       element: <Icon />,
    //     },
    //     {
    //       path: "loading-icon",
    //       element: <LoadingIcon />,
    //     },
    //     {
    //       path: "regular-form",
    //       element: <RegularForm />,
    //     },
    //     {
    //       path: "datepicker",
    //       element: <Datepicker />,
    //     },
    //     {
    //       path: "tom-select",
    //       element: <TomSelect />,
    //     },
    //     {
    //       path: "file-upload",
    //       element: <FileUpload />,
    //     },
    //     {
    //       path: "wysiwyg-editor",
    //       element: <WysiwygEditor />,
    //     },
    //     {
    //       path: "validation",
    //       element: <Validation />,
    //     },
    //     {
    //       path: "chart",
    //       element: <Chart />,
    //     },
    //     {
    //       path: "slider",
    //       element: <Slider />,
    //     },
    //     {
    //       path: "image-zoom",
    //       element: <ImageZoom />,
    //     },
    //   ],
    // },
    // {
    //   path: "/top-menu",
    //   element: <TopMenu />,
    //   children: [
    //     {
    //       path: "dashboard-overview-1",
    //       element: <DashboardOverview1 />,
    //     },
    //     {
    //       path: "dashboard-overview-2",
    //       element: <DashboardOverview2 />,
    //     },
    //     {
    //       path: "dashboard-overview-3",
    //       element: <DashboardOverview3 />,
    //     },
    //     {
    //       path: "dashboard-overview-4",
    //       element: <DashboardOverview4 />,
    //     },
    //     {
    //       path: "categories",
    //       element: <Categories />,
    //     },
    //     {
    //       path: "add-product",
    //       element: <AddProduct />,
    //     },
    //     {
    //       path: "product-list",
    //       element: <ProductList />,
    //     },
    //     {
    //       path: "product-grid",
    //       element: <ProductGrid />,
    //     },
    //     {
    //       path: "transaction-list",
    //       element: <TransactionList />,
    //     },
    //     {
    //       path: "transaction-detail",
    //       element: <TransactionDetail />,
    //     },
    //     {
    //       path: "seller-list",
    //       element: <SellerList />,
    //     },
    //     {
    //       path: "seller-detail",
    //       element: <SellerDetail />,
    //     },
    //     {
    //       path: "reviews",
    //       element: <Reviews />,
    //     },
    //     {
    //       path: "inbox",
    //       element: <Inbox />,
    //     },
    //     {
    //       path: "file-manager",
    //       element: <FileManager />,
    //     },
    //     {
    //       path: "point-of-sale",
    //       element: <PointOfSale />,
    //     },
    //     {
    //       path: "chat",
    //       element: <Chat />,
    //     },
    //     {
    //       path: "post",
    //       element: <Post />,
    //     },
    //     {
    //       path: "calendar",
    //       element: <Calendar />,
    //     },
    //     {
    //       path: "crud-data-list",
    //       element: <CrudDataList />,
    //     },
    //     {
    //       path: "crud-form",
    //       element: <CrudForm />,
    //     },
    //     {
    //       path: "users-layout-1",
    //       element: <UsersLayout1 />,
    //     },
    //     {
    //       path: "users-layout-2",
    //       element: <UsersLayout2 />,
    //     },
    //     {
    //       path: "users-layout-3",
    //       element: <UsersLayout3 />,
    //     },
    //     {
    //       path: "profile-overview-1",
    //       element: <ProfileOverview1 />,
    //     },
    //     {
    //       path: "profile-overview-2",
    //       element: <ProfileOverview2 />,
    //     },
    //     {
    //       path: "profile-overview-3",
    //       element: <ProfileOverview3 />,
    //     },
    //     {
    //       path: "wizard-layout-1",
    //       element: <WizardLayout1 />,
    //     },
    //     {
    //       path: "wizard-layout-2",
    //       element: <WizardLayout2 />,
    //     },
    //     {
    //       path: "wizard-layout-3",
    //       element: <WizardLayout3 />,
    //     },
    //     {
    //       path: "blog-layout-1",
    //       element: <BlogLayout1 />,
    //     },
    //     {
    //       path: "blog-layout-2",
    //       element: <BlogLayout2 />,
    //     },
    //     {
    //       path: "blog-layout-3",
    //       element: <BlogLayout3 />,
    //     },
    //     {
    //       path: "pricing-layout-1",
    //       element: <PricingLayout1 />,
    //     },
    //     {
    //       path: "pricing-layout-2",
    //       element: <PricingLayout2 />,
    //     },
    //     {
    //       path: "invoice-layout-1",
    //       element: <InvoiceLayout1 />,
    //     },
    //     {
    //       path: "invoice-layout-2",
    //       element: <InvoiceLayout2 />,
    //     },
    //     {
    //       path: "faq-layout-1",
    //       element: <FaqLayout1 />,
    //     },
    //     {
    //       path: "faq-layout-2",
    //       element: <FaqLayout2 />,
    //     },
    //     {
    //       path: "faq-layout-3",
    //       element: <FaqLayout3 />,
    //     },
    //     {
    //       path: "update-profile",
    //       element: <UpdateProfile />,
    //     },
    //     {
    //       path: "change-password",
    //       element: <ChangePassword />,
    //     },
    //     {
    //       path: "regular-table",
    //       element: <RegularTable />,
    //     },
    //     {
    //       path: "tabulator",
    //       element: <Tabulator />,
    //     },
    //     {
    //       path: "modal",
    //       element: <Modal />,
    //     },
    //     {
    //       path: "slide-over",
    //       element: <SlideOver />,
    //     },
    //     {
    //       path: "notification",
    //       element: <Notification />,
    //     },
    //     {
    //       path: "tab",
    //       element: <Tab />,
    //     },
    //     {
    //       path: "accordion",
    //       element: <Accordion />,
    //     },
    //     {
    //       path: "button",
    //       element: <Button />,
    //     },
    //     {
    //       path: "alert",
    //       element: <Alert />,
    //     },
    //     {
    //       path: "progress-bar",
    //       element: <ProgressBar />,
    //     },
    //     {
    //       path: "tooltip",
    //       element: <Tooltip />,
    //     },
    //     {
    //       path: "dropdown",
    //       element: <Dropdown />,
    //     },
    //     {
    //       path: "typography",
    //       element: <Typography />,
    //     },
    //     {
    //       path: "icon",
    //       element: <Icon />,
    //     },
    //     {
    //       path: "loading-icon",
    //       element: <LoadingIcon />,
    //     },
    //     {
    //       path: "regular-form",
    //       element: <RegularForm />,
    //     },
    //     {
    //       path: "datepicker",
    //       element: <Datepicker />,
    //     },
    //     {
    //       path: "tom-select",
    //       element: <TomSelect />,
    //     },
    //     {
    //       path: "file-upload",
    //       element: <FileUpload />,
    //     },
    //     {
    //       path: "wysiwyg-editor",
    //       element: <WysiwygEditor />,
    //     },
    //     {
    //       path: "validation",
    //       element: <Validation />,
    //     },
    //     {
    //       path: "chart",
    //       element: <Chart />,
    //     },
    //     {
    //       path: "slider",
    //       element: <Slider />,
    //     },
    //     {
    //       path: "image-zoom",
    //       element: <ImageZoom />,
    //     },
    //   ],
    // },
    {
      path: "/login",
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: <Register />,
    },
    
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
