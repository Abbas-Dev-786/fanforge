import { ThemeProvider } from "@mui/material";
import PropTypes from "prop-types";
import theme from "@/config/theme";

const MUIProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

MUIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MUIProvider;
