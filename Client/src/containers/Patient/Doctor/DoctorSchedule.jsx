import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailDoctor.scss";
import { languages } from "../../../utils/constant";
import moment from "moment";
import localization from "moment/locale/vi";
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
        };
    }
    async componentDidMount() {
        let { language } = this.props;
        console.log("moment vie: ", moment(new Date()).format("dddd - DD/YY"));
        console.log(
            "moment en: ",
            moment(new Date()).locale("en").format("ddd - DD/YY"),
        );

        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            object.label = moment(new Date())
                .add(i, "days")
                .format("dddd - DD/YY");
            object.value = moment(new Date())
                .add(i, "days")
                .startOf("day")
                .valueOf();
            arrDate.push(object);
        }
    }
    componentDidUpdate = (prevProps, prevState, snapshot) => {};
    render() {
        return (
            <div className="doctor-schedule-container">
                <div className="all-schedule">
                    <select name="" id="">
                        <option value="">Thứ 2</option>
                        <option value="">Thứ 3</option>
                        <option value="">Thứ 4</option>
                        <option value="">Thứ 5</option>
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
