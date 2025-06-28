import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { crud_actions, languages } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Save to markdown table
            contentMarkdown: "",
            contentHTML: "",
            selectedOption: "",
            description: "",
            listDoctors: [],
            hasOldData: false,

            // Save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: "",
            selectedPayment: "",
            selectedProvince: "",
            nameClinic: "",
            addressClinic: "",
            note: "",
        };
    }

    // Gọi một lần ko update
    componentDidMount = () => {
        this.props.fetchAllDoctor(); // Fetch all doctors when the component mounts
        // You can also fetch other necessary
        this.props.getAllRequireDoctorInfo();
    };
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi =
                    type === "USERS"
                        ? `${item.lastName} ${item.firstName}`
                        : item.valueVi;
                let labelEn =
                    type === "USERS"
                        ? `${item.firstName} ${item.lastName}`
                        : item.valueEn;
                object.label = language === languages.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };

    // Props có sự thay đổi thì sẽ được gọi
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(
                this.props.allDoctors,
                "USERS",
            );
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (
            prevProps.allRequiredDoctorInfor !==
                this.props.allRequiredDoctorInfor &&
            this.props.allRequiredDoctorInfor
        ) {
            let { resPayment, resPrice, resProvince } =
                this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "");
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "");
            let dataSelectProvince = this.buildDataInputSelect(resProvince, "");
            console.log(dataSelectPrice, dataSelectPayment, dataSelectProvince);
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
    };
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    };
    handleChangeSelect = async (selectedOption) => {
        console.log("select", selectedOption);
        console.log("state", this.state);
        this.setState({ selectedOption }, () => {
            console.log("newstate", this.state);
        });
        let res = await getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
            });
        } else {
            this.setState({
                contentHTML: "",
                contentMarkdown: "",
                description: "",
                hasOldData: false,
            });
        }
    };
    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action:
                hasOldData === true ? crud_actions.EDIT : crud_actions.CREATE,
        });
    };
    handleOnChangeDescription = (event) => {
        this.setState({
            description: event.target.value,
        });
    };
    render() {
        let { hasOldData } = this.state;

        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="more-infor">
                    <div className="content-left form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.select-doctor" />
                        </label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={"Chọn bác sĩ"}
                        />
                    </div>
                    <div className="content-right">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.intro" />
                        </label>
                        <textarea
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangeDescription(event)
                            }
                            value={this.state.description}
                        ></textarea>
                    </div>
                </div>

                <div className="more-infor-extra row">
                    <div className="col-4 form-group">
                        <label htmlFor="">Chọn giá</label>
                        <Select
                            // value={this.state.selectedOption}
                            // onChange={this.handleChangeSelect}
                            options={this.state.listPrice}
                            placeholder={"Chọn giá"}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label htmlFor="">Chọn phương thức thanh toán</label>
                        <Select
                            // value={this.state.selectedOption}
                            // onChange={this.handleChangeSelect}
                            options={this.state.listPayment}
                            placeholder={"Chọn phương thức thanh toán"}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label htmlFor="">Chọn tỉnh thành</label>
                        <Select
                            // value={this.state.selectedOption}
                            // onChange={this.handleChangeSelect}
                            options={this.state.listProvince}
                            placeholder={"Chọn tỉnh thành"}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label htmlFor="">Tên phòng khám</label>
                        <input className="form-control" />
                    </div>

                    <div className="col-4 form-group">
                        <label htmlFor="">Địa chỉ phòng khám</label>
                        <input className="form-control" />
                    </div>

                    <div className="col-4 form-group">
                        <label htmlFor="">Lưu ý</label>
                        <input className="form-control" />
                    </div>
                </div>

                <div className="manage-doctor-editor mt-3">
                    <MdEditor
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    className={
                        hasOldData === true
                            ? "save-content-doctor"
                            : "create-content-doctor"
                    }
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    {hasOldData === true ? (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save" />
                        </span>
                    ) : (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.add" />
                        </span>
                    )}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        getAllRequireDoctorInfo: () => dispatch(actions.getRequireDoctorInfo()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
