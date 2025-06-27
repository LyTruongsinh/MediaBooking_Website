import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import { languages } from "../../../utils/constant";
import moment from "moment";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDate } from "../../../services/userService";
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
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
            let dateMoment = moment(new Date()).add(i, "days");
            if (language === languages.VI) {
                if (i === 0) {
                    object.label = `Hôm nay - ${dateMoment.format("DD/MM")}`;
                } else {
                    object.label = dateMoment
                        .format("dddd - DD/MM")
                        .replace(/^./, (str) => str.toUpperCase());
                }
            } else {
                if (i === 0) {
                    object.label = `Today - ${dateMoment
                        .locale("en")
                        .format("DD/MM")}`;
                } else {
                    object.label = dateMoment
                        .locale("en")
                        .format("ddd - DD/MM");
                }
            }
            object.value = dateMoment.startOf("day").valueOf();
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
        if (this.props.doctorId && this.props.doctorId !== -1) {
            let doctorId = this.props.doctorId;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                });
            }
        }
    };
    render() {
        let { allDays, allAvailableTime } = this.state;
        let { language } = this.props;
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
                <div className="all-available-time">
                    <div className="text-calendar">
                        <i className="fas fa-calendar-alt">
                            <span>Lịch khám</span>
                        </i>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length > 0 ? (
                                allAvailableTime.map((item, index) => {
                                    let timeDisplay =
                                        language === languages.VI
                                            ? item.timeTypeData.valueVi
                                            : item.timeTypeData.valueEn;
                                    return (
                                        <button key={index}>
                                            {timeDisplay}
                                        </button>
                                    );
                                })
                            ) : (
                                <div>
                                    Không có lịch hẹn trong thời gian này vui
                                    lòng chọn thời gian khác!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
