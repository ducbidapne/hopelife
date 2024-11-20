import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const inputWidth = width * 0.9; // Chiều rộng input chiếm 90% màn hình
const buttonWidth = width * 0.9; // Chiều rộng button chiếm 90% màn hình
const logoSize = width * 0.5; // Kích thước logo là 50% chiều rộng màn hình

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: height * 0.035, // Tỉ lệ với chiều cao màn hình
    fontWeight: "800",
    marginBottom: height * 0.01,
    color: "#1A237E",
  },
  textEmail: {
    height: height * 0.06,
    width: inputWidth,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: height * 0.01,
    paddingLeft: 10,
    fontSize: height * 0.02,
    color: "#3C4858",
    shadowColor: "#9E9E9E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textPassword: {
    height: height * 0.06,
    width: inputWidth,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: height * 0.01,
    paddingLeft: 10,
    fontSize: height * 0.02,
    color: "#3C4858",
    shadowColor: "#9E9E9E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    height: height * 0.06,
    width: buttonWidth,
    marginVertical: height * 0.02,
    backgroundColor: "#5C6BC0",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: height * 0.022,
    fontWeight: "600",
  },
  textForgotPassword: {
    color: "#5C6BC0",
    fontSize: height * 0.02,
    fontWeight: "600",
    marginBottom: height * 0.02,
    marginLeft: width * 0.4,
  },
  textSignUp: {
    color: "#5C6BC0",
    fontSize: height * 0.02,
    fontWeight: "600",
    marginLeft: 10,
  },
  appLogo: {
    width: logoSize,
    height: logoSize,
    borderRadius: logoSize / 2,
    marginBottom: height * 0.1,
  },
  appName: {
    fontSize: height * 0.05,
    fontWeight: "700",
    marginBottom: height * 0.1,
    color: "#1A237E",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
  },
};

export default styles;
