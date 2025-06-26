import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailDoctor.scss";
import { languages } from "../../../utils/constant";
import moment from "moment";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDate } from "../../../services/userService";
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
        };
    }
    // thực hiện một lần
    async componentDidMount() {
        let { language } = this.props;
        this.setArrayDays(language);
    }
    setArrayDays = (language) => {
        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (this.props.language === languages.VI) {
                object.label = moment(new Date())
                    .add(i, "days")
                    .format("dddd - DD/YY");
            } else {
                object.label = moment(new Date())
                    .add(i, "days")
                    .locale("en")
                    .format("ddd - DD/YY");
            }

            object.value = moment(new Date())
                .add(i, "days")
                .startOf("day") // lấy bắt đầu 1 ngày 0 h 0 p 0 s
                .valueOf(); // convert sang Unix Time
            arrDate.push(object);
        }

        this.setState({
            allDays: arrDate,
        });
    };
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.language !== prevProps.language) {
            this.setArrayDays(this.props.language);
        }
    };
    handleOnchangeSelect = async (event) => {
        if (
            this.props.doctorId &&
            this.props.doctorId !== -1
        ) {
            let doctorId = this.props.doctorId;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            console.log("check res schedule", res);
        }
    };
    render() {
        let { allDays } = this.state;
        return (
            <div className="doctor-schedule-container">
                <div className="all-schedule">
                    <select
                        onChange={(event) => this.handleOnchangeSelect(event)}
                    >
                        {allDays &&
                            allDays.length > 0 &&
                            allDays.map((item, index) => {
                                return (
                                    <option value={item.value} key={index}>
                                        {item.label}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                <div className="all-available-time"></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
