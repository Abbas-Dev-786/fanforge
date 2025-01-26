import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

export const navigations = [
  {
    label: "Home",
    path: "#", // '/',
  },
  {
    label: "Courses",
    path: "popular-course", // '/popular-course',
  },
  {
    label: "Testimonial",
    path: "testimonial", // '/testimonial',
  },
  {
    label: "Mentor",
    path: "mentors", // '/mentors',
  },
];

export const expsHero = [
  {
    label: "Students",
    value: "10K+",
  },
  {
    label: "Quality Course",
    value: "20+",
  },
  {
    label: "Experience Mentors",
    value: "10+",
  },
];

export const featureData = [
  {
    title: "Easy Accessable",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
    icon: <ArtTrackIcon />,
  },
  {
    title: "More Affordable Cost",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
    icon: <AttachMoneyIcon />,
  },
  {
    title: "Flexible Study Time",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
    icon: <LocalLibraryIcon />,
  },
  {
    title: "Consultation With Mentor",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
    icon: <ContactSupportIcon />,
  },
];
