import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles({
  root: {
    " &:disabled": {
      backgroundColor: "#706c61",
      color: "white",
    },
  },
});

const ButtonComponent = ({
  label = "Button",
  variant = "contained",
  onBtnClick = () => {},
  size = "small",
  muiProps = "",
  borderRadius = "4px",
  textColor = "color-white",
  bgColor = "bg-btn",
  fullWidth = false,
  disabled = false,
  children,
  component = "",
  iconPosition = "start",
  icon = <DeleteIcon />,
  showIcon = false,
  sx = {},
  onMouseLeave = () => {},
  onMouseEnter = () => {},
}) => {
  const classes = useStyles();

  let IconProp = showIcon
    ? iconPosition === "start"
      ? {
          startIcon: icon,
        }
      : { endIcon: icon }
    : {};

  return (
    <Button
      component={component}
      {...IconProp}
      variant={variant}
      onClick={onBtnClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      size={size}
      className={`${
        disabled === true
          ? classes.root
          : // eslint-disable-next-line no-nested-ternary
          variant === "contained"
          ? `${bgColor} ${textColor}`
          : variant === "outlined"
          ? `${textColor}`
          : variant === "text"
          ? `${textColor}`
          : ""
      }  
      ${muiProps}`}
      sx={{
        textTransform: "capitalize",
        borderRadius: { borderRadius },
        paddingX: 3,
        paddingY: 1,
        ...sx,
      }}
      fullWidth={fullWidth}
      disabled={disabled}
      disableFocusRipple
      disableElevation
    >
      {label}
      {children}
      {children}
    </Button>
  );
};

export default ButtonComponent;
