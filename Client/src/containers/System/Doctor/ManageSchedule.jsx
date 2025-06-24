import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { FormattedMessage } from "react-intl";
import "./ManageSchedule.scss";
import * as actions from "../../../store/actions";
import { crud_actions, languages, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: "",
            rangeTime: [],
        };
    }

    componentDidMount = () => {
        this.props.fetchAllDoctor();
        this.props.fetchAllScheduleTime();
    };
    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === languages.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.allScheduleTimes !== this.props.allScheduleTimes) {
            let data = this.props.allScheduleTimes;
            if (data && data.length > 0) {
                data.map((item) => {
                    item.isSelected = false;
                    return item;
                });
            }

            this.setState({
                rangeTime: data,
            });
        }
        // if (prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
        //     this.setState({
        //         listDoctors: dataSelect,
        //     });
        // }
    };
    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption,
        });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        });
    };
    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            });
            this.setState({
                rangeTime: rangeTime,
            });
        }
    };
    handleSaveSchedule = () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error("Invalid date!");
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor!");
            return;
        }
        let formatedDate = moment(currentDate).format(
            dateFormat.SEND_TO_SERVER,
        );
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(
                (item) => item.isSelected === true,
            );
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((time) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.time = time.keyMap;
                    result.push(object);
                });
            } else {
                toast.error("Invalid selected time!");
                return;
            }
        }
        
    };
    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        console.log("check state time", rangeTime);
        return (
            <div className="manage-schedule-containter">
                <div className="m-s-title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-schedule.select-doctor" />
                            </label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-schedule.select-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime &&
                                rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            className={
                                                item.isSelected === true
                                                    ? "btn btn-schedule active"
                                                    : "btn btn-schedule"
                                            }
                                            key={index}
                                            onClick={() =>
                                                this.handleClickBtnTime(item)
                                            }
                                        >
                                            {language === languages.VI
                                                ? item.valueVi
                                                : item.valueEn}
                                        </button>
                                    );
                                })}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTimes: state.admin.allScheduleTimes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
